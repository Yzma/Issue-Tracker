import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "@/lib/sessions"

import { LabelCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {

  const { namespaceName, projectName } = req.query

  if (req.method === "GET") {

    return await prisma.label
      .findMany({
        where: {
          project: {
            name: projectName,
            namespace: {
              name: namespaceName
            }
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

  } else if (req.method === "POST") {
    const { name, description, color } = req.body

    let schemaResult
    try {
      schemaResult = await LabelCreationSchema.validate({
        name,
        description,
        color
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

    const foundNamespace = await prisma.namespace.findUnique({
      where: {
        name: namespaceName
      }
    })
    console.log("foundNamespace: ", foundNamespace)

    if (!foundNamespace) {
      return res.status(400).json({ error: "Not a valid namespace" })
    }

    if (foundNamespace.userId) {
      if (foundNamespace.userId != session.user.id) {
        return res
          .status(400)
          .json({ error: "User is not who they say they are" })
      }
    } else if (foundNamespace.organizationId) {
      // TODO: Check org member
      // const foundOrganizationMember =
      //   await prisma.organizationMember.findUnique({
      //     where: {
      //       userId_organizationId: {
      //         userId: session.user.id,
      //         organizationId: foundNamespace.organizationId
      //       }
      //     }
      //   })

      // if (!foundOrganizationMember) {
      //   return res.status(400).json({ error: "Not in the organization" })
      // }

      // console.log("foundOrganizationMember", foundOrganizationMember)

      // if (foundOrganizationMember.role != "Owner") {
      //   return res.status(400).json({ error: "User isn't an owner" })
      // }
    } else {
      // Note: There is a constraint on the database top not allow this to happen so this check will probably be removed in the future
      console.log("ERROR: Namespace does not have a user or and organization")
      return res.status(400).json({ error: "Debug: This should never happen" })
    }

    return await prisma.project
      .update({
        where: {
          namespaceId_name: {
            name: projectName,
            namespaceId: foundNamespace.id
          }
        },
        data: {
          labels: {
            create: {
              name,
              description,
              color
            }
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
