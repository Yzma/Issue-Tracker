import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { setCookie } from 'cookies-next';
import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'

import jwt from "jsonwebtoken"
import { decryptJwt } from "@/lib/jwt"
import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookie = req.cookies["new-user-cookie"]

    if (!cookie) {
      return res.status(400).json({ error: "Request did not have cookie" })
    }

    const { name } = req.body

    // const token = await new Promise((resolve, reject) => {
    //   // jwt.verify(cookie, process.env.NEXTAUTH_SECRET, async (err, decoded) => {
    //   //   if (err) {
    //   //     console.log("Error decoding json token: ", err)
    //   //     return reject(null)
    //   //   }
    //   //   console.log("decoded: ", decoded["session"])
    //   //   return resolve(decoded)
    //   // }

    //   console.log()
    // )})

    let token
    try {
      token = await decryptJwt(cookie);
    } catch(e) {
      return res.status(400).json({ error: "Error decoding provided JSON token" })
    }

    if(!token) {
      return res.status(400).json({ error: "Error decoding provided JSON token" })
    }

    if(true) {
      console.log(token)
      console.log()
      console.log("Stringify", JSON.stringify(token))
      const options = token.payload.session.options
      setCookie(NEXT_AUTH_SESSION_COOKIE, token.payload.session.value, { req, res, options })
      setCookie(NEW_USER_COOKIE, "", { req, res, maxAge: -1 })
      console.log("Are we here?")
      return res.status(200).json({ error: "success" })
    }

    try {
      NamespaceNameCreationSchema.validate({ name })
    } catch (e) {
      return res.status(400).json({ error: "Invalid name" })
    }

    const session = await getServerSession(req, res, authOptions(req, res))
    console.log(77)
    if (!session) {
      console.log(777)
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    return prisma.namespace.create({
      data: {
        name,
        userId: session.user.id
      }
    })
    .then((result) => {
      console.log("API RESULT: ", result)
      setCookie(NEXT_AUTH_SESSION_COOKIE, decoded.session, { req, res })
      setCookie(NEW_USER_COOKIE, "", { req, res, maxAge: -1 })
      console.log("Are we here?")
      return res.redirect("/")
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
