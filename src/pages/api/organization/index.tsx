import prisma from "@/lib/prisma/prisma"
import { getServerSession } from "@/lib/sessions"

import { OrganizationNameCreationSchema } from "@/lib/yup-schemas"

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name } = req.body

    try {
      await OrganizationNameCreationSchema.validate({ name })
    } catch (e) {
      console.log("name error: ", name)
      return res.status(400).json({ error: "Invalid name" })
    }

    const session = await getServerSession(req, res)
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    return await prisma.organization
      .create({
        data: {
          name,
          userId: session.user.id,
          members: {
            create: {
              userId: session.user.id,
              role: "Owner"
            }
          },
          namespace: {
            create: {
              name
            }
          }
        }
      })
      .then((result) => {
        console.log("API RESULT: ", result)
        return res.status(200).json({ name: result.name })
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
