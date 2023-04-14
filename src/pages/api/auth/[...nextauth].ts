import NextAuth, { AuthOptions, NextAuthOptions, Profile } from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import CustomPrismaAdapter from "@/lib/prisma/prisma-adapter"
import prisma from "@/lib/prisma/prisma"

import { generateToken } from "@/lib/jwt"
import { NEW_USER_COOKIE } from "@/lib/constants"
import { setCookie } from "cookies-next"

import { NextApiRequest, NextApiResponse } from "next"

export function authOptions(req: NextApiRequest, res: NextApiResponse): AuthOptions {
  return {
    // @ts-ignore
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
    pages: {
      signIn: "/signin"
    },
    callbacks: {
      async signIn(params) {
        console.log("signIn obj: ", params)

        // If the user doesn't have a namespace yet, then their still in the process of creating their account
        if (!params.user.namespace) {
          return await setupUserOnboarding(params, req, res)
            .then((result) => {
              console.log("setupUserOnboarding result: ", result)
              if (result) {
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

      session({ session, user }) {
        session.user.id = user.id
        session.user.namespace = {
          id: user.namespace.id,
          name: user.namespace.name
        }
        return session
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions(req, res))
}

// TODO: Comment, rename function, and figure out how code should be written for readability
async function setupUserOnboarding(userObj, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
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

      return generateToken({ data: result.id }, { expiresIn: "1h" }).then(token => setCookie(NEW_USER_COOKIE, token, { req, res }))
        .then(_ => false)
    })
}
