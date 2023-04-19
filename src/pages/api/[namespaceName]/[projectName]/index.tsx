import prisma from "@/lib/prisma/prisma"
import { getServerSession } from "@/lib/sessions"

import { CommentCreationSchema } from "@/lib/yup-schemas"

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
  const { namespaceName, projectName } = req.query

  if(req.method === "PUT") {

    const { name } = req.body

    return await prisma.project
      .updateMany({
        where: {
          // @ts-ignore
          name: projectName,
          namespace: {
            // @ts-ignore
            name: namespaceName
          }
        },
        data: {
          name
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

  } else if(req.method === "DELETE") {

  } else {
    res.json({ error: "Not supported" })
  }
}
