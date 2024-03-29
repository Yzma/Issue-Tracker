import NextAuth, { Account, AuthOptions, Profile, User } from 'next-auth'

import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { setCookie } from 'cookies-next'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AdapterUser } from 'next-auth/adapters'
import CustomPrismaAdapter from '@/lib/prisma/prisma-adapter'
import prisma from '@/lib/prisma/prisma'

import { generateToken } from '@/lib/jwt'
import { NEW_USER_COOKIE } from '@/lib/constants'

export type ApiRouteRequest = {
  req: NextApiRequest
  res: NextApiResponse
}

export type GetServerSidePropsRequest = {
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
}

export type Context = ApiRouteRequest | GetServerSidePropsRequest

type OnboardingParams = {
  user: User | AdapterUser
  account: Account
  profile: Profile
}

export function authOptions(context: Context): AuthOptions {
  return {
    // @ts-ignore
    adapter: CustomPrismaAdapter(prisma),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ],
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async signIn(params) {
        const { user, account, profile } = params
        console.log('signIn obj: ', { user, account, profile })

        // If the user doesn't have a namespace yet, then their still in the process of creating their account
        if (!params.user.namespace) {
          return setupUserOnboarding({ user, account, profile }, context)
            .then((result) => {
              console.log('setupUserOnboarding result: ', result)
              if (result) {
                return true
              }
              return '/finish'
            })
            .catch((e) => {
              console.log('Error during onboarding: ', e)
              return '/500'
            })
        }
        return true
      },

      session({ session, user }) {
        session.user.id = user.id
        session.user.username = user.username
        session.user.namespace = {
          id: user.namespace.id,
          name: user.namespace.name,
        }
        return session
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions({ req, res }))
}

// TODO: Comment, rename function, and figure out how code should be written for readability
async function setupUserOnboarding(
  userObj: OnboardingParams,
  context: Context
): Promise<boolean> {
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
        session_state: account.session_state,
      }

      if (!profile.email) {
        throw new Error(`profile is missing an email`)
      }

      // TODO: Only select fields that are needed
      const upsertUser = await tx.user.upsert({
        where: {
          email: profile.email,
        },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          // emailVerified: user.emailVerified,
          image: user.image,
        },
      })

      await tx.account.upsert({
        where: {
          provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
          },
        },
        update: {
          ...accountInfo,
        },
        create: {
          ...accountInfo,
          user: {
            connect: {
              id: upsertUser.id,
            },
          },
        },
      })

      return upsertUser
    })
    .then((result) => {
      console.log()
      console.log('Result from promise: ', result)
      if (result.username) {
        console.log(
          'User already has username, they linked another account and logged in'
        )
        return true
      }

      return generateToken({ data: result.id }, { expiresIn: '1h' }).then(
        (token) => {
          if (isApiRouteRequest(context)) {
            setCookie(NEW_USER_COOKIE, token, {
              req: context.req,
              res: context.res,
            })
          } else {
            setCookie(NEW_USER_COOKIE, token, {
              req: context.context.req,
              res: context.context.res,
            })
          }
          return false
        }
      )
    })
}

function isApiRouteRequest(object: any): object is ApiRouteRequest {
  return 'req' in object
}
