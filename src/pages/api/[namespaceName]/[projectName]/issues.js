import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "@/lib/sessions"

import { IssueCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {

    const { namespaceName, projectName } = req.query
    const { name, description } = req.body

    let schemaResult
    try {
      schemaResult = await IssueCreationSchema.validate({
        name,
        description
      })
    } catch (e) {
      console.log("Invalid arguments for issue creation: ", e)
      return res.status(400).json({ error: "Invalid arguments" })
    }

    console.log("schemaResult", schemaResult)

    const session = await getServerSession(req, res)
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    // model Project {
    //   name        String  @default(cuid())
    //   description String  @default(cuid()) @db.Text()
    //   private     Boolean
    
    //   namespaceId String
    //   namespace   Namespace @relation(fields: [namespaceId], references: [id])
    
    //   issues Issue[]
    //   labels Label[]
    // @@unique([namespaceId, name])
    // }

    // model Issue {
    //   name        String  @default(cuid())
    //   description String  @default(cuid()) @db.Text()

    //   userId String
    //   user   User   @relation(fields: [userId], references: [id])
    
    //   projectId String
    //   project   Project @relation(fields: [projectId], references: [id])
    
    //   labels   Label[]
    // }

    // model OrganizationMember {
    //   id String @id @default(cuid())
    
    //   role      OrganizationRole
    //   createdAt DateTime         @default(now())
    
    //   userId String
    //   user   User   @relation(fields: [userId], references: [id])
    
    //   organizationId String
    //   organization   Organization @relation(fields: [organizationId], references: [id])
    
    //   @@unique([userId, organizationId])
    // }

    const foundNamespace = await prisma.namespace.findUnique({
      where: {
        name: namespaceName
      }
    })

    if (!foundNamespace) {
      return res.status(400).json({ error: "Not a valid namespace" })
    }

    if (foundNamespace.userId) {
      // TODO: Look to improve readability here
      if (foundNamespace.userId != session.user.id) {
        return res.status(400).json({ error: "User is not who they say they are" })
      }

    } else if (foundNamespace.organizationId) {

      const foundOrganizationMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: session.user.id,
            organizationId: foundNamespace.organizationId
          }
        }
      })
  
      if (!foundOrganizationMember) {
        return res.status(400).json({ error: "Not in the organization" })
      }

      console.log("foundOrganizationMember", foundOrganizationMember)

      if (foundOrganizationMember.role != "Owner") {
        return res.status(400).json({ error: "User isn't an owner" })
      }

    } else {
      // Note: There is a constraint on the database top not allow this to happen so this check will probably be removed in the future
      console.log("ERROR: Namespace does not have a user or and organization")
      return res.status(400).json({ error: "Debug: This should never happen" })
    }

    console.log("foundNamespace: ", foundNamespace)

    const foundProject = await prisma.project.findMany({
      where: {
        name: projectName
      }
    })

    if (!foundProject) {
      return res.status(400).json({ error: "Not a valid project" })
    }

    console.log("foundProject: ", foundProject)

    return await prisma.issue
      .create({
        data: {
          name,
          description,
          userId: session.user.id,
          projectId: foundProject[0].id
        }
      })
      .then((result) => {
        console.log("API RESULT: ", result)
        return res.status(200).json({ result: result })
      })
      .catch((err) => {
        // TODO: Check individual error codes from prisma. Check if the name already exists, if the user already has a namespace, etc
        console.log("error: ", err)
        return res
          .status(400)
          .json({ error: "Error creating entry in database" })
      })
  } else {
    res.json({ error: "Not supported" })
  }
}
