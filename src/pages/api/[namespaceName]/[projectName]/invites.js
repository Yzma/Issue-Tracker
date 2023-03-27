import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  const { namespaceName, projectName } = req.query

  if (req.method === "POST") {
    const { name, role } = req.body

    try {
      await NamespaceNameCreationSchema.validate({ name })
    } catch (e) {
      console.log("name error: ", name)
      return res.status(400).json({ error: "Invalid name" })
    }

    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    const foundNamespace = await prisma.namespace.findUnique({
      where: {
        name: namespaceName
      }
    })

    if (!foundNamespace) {
      return res.status(400).json({ error: "Namespace not found" })
    }

    console.log(foundNamespace)

    const foundProject = await prisma.project.findFirst({
      where: {
        name: projectName,
        namespaceId: foundNamespace.id
      }
    })

    if (!foundProject) {
      return res.status(400).json({ error: "Project not found" })
    }

    console.log("Project ", foundProject)

    // TODO: Authorize user creating invite
    return await prisma.memberInvitation
      .create({
        data: {
          role,
          invitedUser: {
            connect: {
              username: name
            }
          },
          inviteeUser: {
            connect: {
              id: session.user.id
            }
          },
          project: {
            connect: {
              id: foundProject.id
            }
          }
        }
      })
      .then((result) => {
        console.log("API RESULT: ", result)
        return res.status(200).json({ name: "Hello?" })
      })
      .catch((err) => {
        // TODO: Check individual error codes from prisma. Check if the name already exists, if the user already has a namespace, etc
        console.log("error: ", err)
        return res
          .status(400)
          .json({ error: err.code })
      })
  }

  if (req.method === "DELETE") {
    const { inviteId } = req.body

    console.log("invite id", inviteId)

    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    return await prisma.memberInvitation
      .delete({
        where: {
          id: inviteId
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
          .json({ error: "Error deleting entry in database" })
      })
  } else {
    res.json({ error: "Not supported" })
  }
}
