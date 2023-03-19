import NextAuth from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import CustomPrismaAdapter from "@/lib/prisma/prisma-adapter"
import prisma from "@/lib/prisma/prisma"

import { setCookie } from "cookies-next"

import { NEW_USER_COOKIE } from "@/lib/constants"

import { generateEncryptedJwt } from "@/lib/jwt"

const DEFAULT_MAX_AGE = 24 * 60 * 60 // 1 day

export const authOptions = (req, res) => {
  return {
    adapter: CustomPrismaAdapter(prisma),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ],

    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // FIRST TIME LOGIN
        if (!user.namespace) {
          return { redirect: "/finish", stayLoggedIn: true }
        }

        console.log("User already has namespace")
        return { redirect: `/${user.namespace.name}`, stayLoggedIn: true }
      },

      async session({ session, token, user }) {
        session.user.id = user.id
        session.namespace = user.namespace?.name

        // session.user.settings = {
        //   colorScheme: user.settings.colorScheme
        // }
        return session
      }
    },

    events: {
      async signIn(message) {
        console.log("SIGN IN ")
        console.log(message)
        if (!message.user.namespace) {
          return new Promise((resolve, reject) => {
            const sessionToken = message.cookies.pop()

            const toSign = {
              id: message.user.id,
              session: sessionToken
            }
            // console.log("toSign = ", toSign)

            try {
              return resolve(generateEncryptedJwt("testsub", toSign))
            } catch (e) {
              console.log("JOSE error", e)
              return reject(e)
            }
          })
            .then((token) => {
              // console.log("MESSAGE COOKIES: ", message.cookies)
              // console.log()
              // console.log("TOKEN = ", token)

              setCookie(NEW_USER_COOKIE, token, {
                req,
                res,
                maxAge: DEFAULT_MAX_AGE
              })

              //SELECT * FROM "Session" WHERE "userId"='clfes6o2g0000qqbw070cmzaq' order by expires desc limit 1;

              return "/finish"
            })
            .catch((err) => {
              console.error("Error signing JSON Web token", err)
              return "/500"
            })
        }

        return `/${message.user.namespace.name}`
      }
    }
  }
}

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions(req, res))
}
