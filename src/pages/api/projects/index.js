import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { ProjectCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {

    const { name, description, private: isPrivate } = req.body

    try {
      await ProjectCreationSchema.validate({ name, description, isPrivate })
    } catch (e) {
      console.log("Invalid arguments for project creation: ", e)
      return res.status(400).json({ error: "Invalid arguments" })
    }

    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    return await prisma.project
      .create({
        data: {
          name,
          description,
          private: isPrivate,
          namespace: {
            connect: {
              userId: session.user.id
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
