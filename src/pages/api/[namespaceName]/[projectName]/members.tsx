import prisma from "@/lib/prisma/prisma"
import { getServerSession } from "@/lib/sessions"

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "DELETE") {
    const { memberId } = req.body

    console.log("memberId", memberId)

    const session = await getServerSession(req, res)
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    return await prisma.member
      .delete({
        where: {
          id: memberId
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
