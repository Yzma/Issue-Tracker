import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req, res) {

  const { inviteId } = req.body

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    return await acceptInvite(inviteId, session.user.id)
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

  } else if (req.method === "DELETE") {


    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    return await declineInvite(inviteId, session.user.id)
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

  } else {
    res.json({ error: "Not supported" })
  }
}

async function declineInvite(inviteId, sessionId) {

  return await prisma.$transaction(async (tx) => {
    const deletedOrganizationInvitation =
      await tx.memberInvitation.delete({
        where: {
          id: inviteId
        }
      })

    if (deletedOrganizationInvitation.invitedId != sessionId) {
      throw new Error(`The correct user isn't accepting the invite`)
    }

    if (deletedOrganizationInvitation < 0) {
      throw new Error(`No invitations were deleted`)
    }

    return deletedOrganizationInvitation
  })
}

async function acceptInvite(inviteId, sessionId) {
  console.log("inviteId: ", inviteId)
  return await prisma.$transaction(async (tx) => {
    const deletedOrganizationInvitation =
      await tx.memberInvitation.delete({
        where: {
          id: inviteId
        }
      })

    if (deletedOrganizationInvitation.invitedId != sessionId) {
      throw new Error(`The correct user isn't accepting the invite`)
    }

    if (deletedOrganizationInvitation < 0) {
      throw new Error(`No invitations were deleted`)
    }

    return await prisma.member.create({
      data: {
        role: deletedOrganizationInvitation.role,
        userId: deletedOrganizationInvitation.invitedId,
        organizationId: deletedOrganizationInvitation.organizationId
      }
    })
  })
}
