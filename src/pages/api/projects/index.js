import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "@/lib/sessions"

import { ProjectCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, description, private: isPrivate, owner } = req.body

    let schemaResult
    try {
      schemaResult = await ProjectCreationSchema.validate({
        name,
        description,
        private: isPrivate,
        owner
      })
    } catch (e) {
      console.log("Invalid arguments for project creation: ", e)
      return res.status(400).json({ error: "Invalid arguments" })
    }

    console.log("schemaResult", schemaResult)

    const session = await getServerSession(req, res)
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    const namespaceOwner = await prisma.namespace.findUnique({
      where: {
        name: owner
      }
    })

    if (!namespaceOwner) {
      return res.status(400).json({ error: "Not a valid namespace" })
    }

    if (namespaceOwner.userId) {
      // TODO: Look to improve readability here
      if (
        namespaceOwner.name != session.namespace &&
        namespaceOwner.userId != session.user.id
      ) {
        return res
          .status(400)
          .json({ error: "User is not who they say they are" })
      }
    } else if (namespaceOwner.organizationId) {
      const foundOrganization = await prisma.organization.findUnique({
        where: {
          id: namespaceOwner.organizationId
        }
      })

      if (!foundOrganization) {
        console.log("ERROR: Organization not found when ")
        return res
          .status(400)
          .json({ error: "Debug: This should never happen" })
      }

      // TODO: This is probably redundant
      if (
        namespaceOwner.name != foundOrganization.name &&
        namespaceOwner.organizationId != foundOrganization.id
      ) {
        return res
          .status(400)
          .json({ error: "Organization is not who they say they are" })
      }
    } else {
      // Note: There is a constraint on the database top not allow this to happen so this check will probably be removed in the future
      console.log("ERROR: Namespace does not have a user or and organization")
      return res.status(400).json({ error: "Debug: This should never happen" })
    }

    console.log("namespaceOwner", namespaceOwner)

    return await prisma.project
      .create({
        data: {
          name,
          description,
          private: schemaResult.private,
          namespaceId: namespaceOwner.id,
          labels: {
            create: [
              { name: "Bug", description: "Bug description", color: "392029" },
              {
                name: "Documentation",
                description: "Documentation description",
                color: "122b40"
              },
              {
                name: "Duplicate",
                description: "Duplicate description",
                color: "373c43"
              }
            ]
          }
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
