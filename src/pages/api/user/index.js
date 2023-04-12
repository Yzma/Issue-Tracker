import prisma from "@/lib/prisma/prisma"

import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"
import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from "@/lib/constants"

import jwt from "jsonwebtoken"
import { deleteCookie, setCookie } from "cookies-next"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import adapter from "@/lib/prisma/prisma-adapter"
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookie = req.cookies[NEW_USER_COOKIE]

    if (!cookie) {
      return res.status(400).json({ error: "Request did not have cookie" })
    }

    const { name } = req.body

    try {
      NamespaceNameCreationSchema.validate({ name })
    } catch (e) {
      return res.status(400).json({ error: "Invalid name" })
    }

    console.log("Cookie: ", cookie)

    return await new Promise((resolve, reject) => {
      jwt.verify(cookie, process.env.NEXTAUTH_SECRET, (err, decoded) => {
        if (err) {
          return reject(err)
        }
        return resolve(decoded)
      })
    })
      .then((token) => {
        const userId = token.data
        console.log("Decoded token userId", userId)

        return prisma
        .$transaction(async (tx) => {
         
          const updateResult = await tx.user.update({
            where: {
              id: userId,
              AND: [
                {
                  username: null
                }
              ]
            },
            data: {
              username: name,
              namespace: {
                create: {
                  name: name
                }
              }
            }
          })

          // console.log("Update result: ", updateResult)

          // TODO: Test this. This will probably never be ran as the update statement above will throw an error if something went wrong
          if(!updateResult) {
            throw new Error("Error creating username.")
          }

          return await adapter(tx).createSession({
            sessionToken: uuidv4(),
            userId: updateResult.id,
            expires: fromDate(24 * 60 * 60),
          })  
        })
        .then((result) => {
          console.log("Result: ", result)
          deleteCookie(NEW_USER_COOKIE, { req, res })
          setCookie(NEXT_AUTH_SESSION_COOKIE, result.sessionToken, { req, res })
          return res.status(200).json({ result: result }) // TODO: Send something else
        })
        .catch((err) => {
          // TODO: Check individual error codes from prisma. Check if the name already exists, if the user already has a namespace, etc
          console.log("this is the error: ", err)
          if(err.code === "P2025") {
            return res
            .status(400)
            .json({ error: "Username has already been set for this account. Please try logging in again." })
          }
          //TokenExpiredError
          return res
            .status(400)
            .json({ error: "Error creating entry in database" })
        })
      })
      .catch((err) => {
        console.error("Error decoding JSON token: ", err)
        return res.status(400).json({ error: "Error decoding the token" })
      })

  } else if (req.method === "PUT") {
    const { name, bio, socialLinks } = req.body

    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    // TODO: This is hacky, we'll come back to this - just need to ensure links are saving for now
    const links = {
      "socialLink1": socialLinks[0] || "",
      "socialLink2": socialLinks[1] || "",
      "socialLink3": socialLinks[2] || "",
      "socialLink4": socialLinks[3] || ""
    }

    return await prisma.user
      .update({
        where: {
          id: session.user.id
        },
        data: {
          bio,
          ...links
        }
      })

      .then((result) => {
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

function fromDate(time, date = Date.now()) {
  return new Date(date + time * 1000)
}
