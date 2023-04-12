import NextAuth from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import CustomPrismaAdapter from "@/lib/prisma/prisma-adapter"
import prisma from "@/lib/prisma/prisma"

import { generateToken } from "@/lib/jwt"
import { NEW_USER_COOKIE } from "@/lib/constants"
import { setCookie } from "cookies-next"

export const authOptions = (req, res) => {
  return {
    adapter: CustomPrismaAdapter(prisma),
    // TODO: Other providers to add: Gitlab, LinkedIn
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
    pages: {
      signIn: "/signin"
    },

    callbacks: {
      async signIn(obj) {
        console.log("signIn obj: ", obj)

        // If the user doesn't have a namespace yet, then their still in the process of creating their account
        if (!obj.user.namespace) {
          return await setupUserOnboarding(obj, req, res)
            .then((result) => {
              console.log("setupUserOnboarding result: ", result)
              if(result) {
                return true
              }
              return "/finish"
            })
            .catch((e) => {
              console.log("Error during onboarding: ", e)
              return "/500"
            })
        }
        return true
      },

      async session({ session, user }) {
        console.log("Session callback")
        session.user.id = user.id
        session.namespace = user.namespace?.name
        return session
      }
    }
  }
}

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions(req, res))
}

// TODO: Comment, rename function, and figure out how code should be written for readability
async function setupUserOnboarding(userObj, req, res) {
  const { user, account, profile } = userObj

  return prisma
    .$transaction(async (tx) => {
      const accountInfo = {
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state
      }

      if (!profile.email) {
        throw new Error(`profile is missing an email`)
      }

      // TODO: Only select fields that are needed
      const upsertUser = await tx.user.upsert({
        where: {
          email: profile.email
        },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        }
      })

      await tx.account.upsert({
        where: {
          provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider
          }
        },
        update: {
          ...accountInfo
        },
        create: {
          ...accountInfo,
          user: {
            connect: {
              id: upsertUser.id
            }
          }
        }
      })

      return upsertUser
    })
    .then((result) => {
      console.log()
      console.log("Result from promise: ", result)
      if (result.username) {
        console.log("User already has username, they linked another account and logged in")
        return true
      }

      // const token = generateToken({ data: result.id }, { expiresIn: "1h" })
      // setCookie(NEW_USER_COOKIE, token, { req, res })
      return generateToken({ data: result.id }, { expiresIn: "1h" }).then(token => setCookie(NEW_USER_COOKIE, token, { req, res }))
    })
}
