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

    const foundNamespace = await prisma.namespace.findUnique({
      where: {
        name: namespaceName
      }
    })

    if (!foundNamespace) {
      return res.status(400).json({ error: "Not a valid namespace" })
    }

    const foundProject = await prisma.project.findUnique({
      where: {
        namespaceId_name: {
          name: projectName,
          namespaceId: foundNamespace.id
        }
      }
    })

    if (!foundProject) {
      return res.status(400).json({ error: "Not a valid project" })
    }

    console.log("foundNamespace: ", foundNamespace)
    console.log("foundProject: ", foundProject)

    return await prisma.issue
      .create({
        data: {
          name,
          description,
          userId: session.user.id,
          projectId: foundProject.id
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
