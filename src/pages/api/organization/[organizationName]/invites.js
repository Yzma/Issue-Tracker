import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  const { organizationName } = req.query

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
          organization: {
            connect: {
              name: organizationName
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
          .json({ error: "Error creating entry in database" })
      })
  }

  if (req.method === "DELETE") {
    const { inviteId } = req.body
    console.log("inviteId", inviteId)
    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    // TODO: Authorize user canceling invite
    // const foundMember = await prisma.organizationMember.findMany({
    //   where: {
    //     userId: session.user.id,
    //     organization: {
    //       name: organizationName
    //     }
    //   }
    // })

    // console.log("Member", foundMember)

    // // TODO: Remove debug '1' after testing
    // if (!foundMember) {
    //   return res
    //     .status(400)
    //     .json({
    //       error: "You do not have permission to do this action.1 (not member)"
    //     })
    // }

    // const member = foundMember[0]

    // // TODO: Use constant rather than hard coded string
    // if (member.role !== "Owner") {
    //   return res
    //     .status(400)
    //     .json({
    //       error: "You do not have permission to do this action.2 (not owner)"
    //     })
    // }

    console.log("invite id", inviteId)

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
