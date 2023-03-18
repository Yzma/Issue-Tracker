import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import jwt from "jsonwebtoken"
import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookie = req.cookies["new-user-cookie"]

    if (!cookie) {
      return res.status(400).json({ error: "Request did not have cookie" })
    }

    const { name } = req.body

    jwt.verify(cookie, process.env.NEXTAUTH_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Error decoding json token: ", err)
        return res
          .status(400)
          .json({ error: "Error decoding provided JSON token" })
      }

      try {
        await NamespaceNameCreationSchema.validate({ name })
      } catch (e) {
        return res.status(400).json({ error: "Invalid name" })
      }

      const session = await getServerSession(req, res, authOptions(req, res))
      if (!session) {
        return res.status(400).json({ error: "Invalid session" })
      }

      console.log("Session", JSON.stringify(session, null, 2))

      return prisma.namespace
        .create({
          data: {
            name,
            userId: session.user.id
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
    })
  } else {
    res.json({ error: "Not supported" })
  }
}
