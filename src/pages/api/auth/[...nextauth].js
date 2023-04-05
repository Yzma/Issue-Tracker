import NextAuth from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import CustomPrismaAdapter from "@/lib/prisma/prisma-adapter"
import prisma from "@/lib/prisma/prisma"

import jwt from "jsonwebtoken"
import { generateEncryptedJwt } from "@/lib/jwt"
import { deleteCookie, setCookie, getCookie } from "cookies-next"

import {
  NEW_USER_COOKIE,
  NEXT_AUTH_CALLBACK_URL_COOKIE,
  NEXT_AUTH_SESSION_COOKIE
} from "@/lib/constants"

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
              return "/finish"
            })
            .catch((e) => {
              console.log("Error during onboarding: ", e)
              return "/500"
            })
        }
        return true
      },

      async session({ session, token, user }) {
        console.log("Session callback")
        session.user.id = user.id // TODO: See if this is already set
        session.namespace = user.namespace?.name
        return session
      }
    }
  }
}

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions(req, res))
}

/* If it's a users first time signing in:
    1. Create a User object with await prisma.user.create({}) - We already have the info needed from obj.profile
    2. set a cookie indicating that the user needs to finish setup
    3. In Middleware.js - Redirect the user to /finish if they have the cookie
    4. Note: if the user deletes the cookie and signs in again, then just try-catch a user being created and if it fails, the user already tried before
*/

// TODO: What if the user changes their email?

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

      const newAccount = await tx.account.upsert({
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

      console.log("Upsert result: ", newAccount)
      return newAccount
    })
    .then((result) => {
      console.log()
      console.log("Result from promise: ", result)
      const token = jwt.sign({ data: result.userId }, process.env.NEXTAUTH_SECRET, {
        expiresIn: "1h"
      })
      setCookie(NEW_USER_COOKIE, token, { req, res })
    })
}


/////////////////////////////////////////Version 2?

// return prisma
// .$transaction(async (tx) => {
//   const accountInfo = {
//     type: account.type,
//     provider: account.provider,
//     providerAccountId: account.providerAccountId,
//     refresh_token: account.refresh_token,
//     access_token: account.access_token,
//     expires_at: account.expires_at,
//     token_type: account.token_type,
//     scope: account.scope,
//     id_token: account.id_token,
//     session_state: account.session_state
//   }

//   const newAccount = await tx.account.upsert({
//     where: {
//       providerAccountId: account.providerAccountId,
//       provider: account.provider
//     },
//     update: {
//       ...accountInfo
//     },
//     create: {
//       ...accountInfo,
//       user: {
//         name: user.name,
//         email: user.email,
//         emailVerified: user.emailVerified,
//         image: user.image
//       }
//     }
//   })

  // const upsertUser = await tx.user.upsert({
  //   where: {
  //     email: user.email
  //   },
  //   update: {},
  //   create: {
  //     name: user.name,
  //     email: user.email,
  //     emailVerified: user.emailVerified,
  //     image: user.image
  //   }
  // })
  

//   const userTransaction = await tx.user.update({
//     where: {
//       id: upsertUser.id
//     },

//     data: {
//       accounts: {

//       }
//     },

//     create: {
//       name: userObj.user.name,
//       email: userObj.user.email,
//       emailVerified: userObj.user.emailVerified,
//       image: userObj.user.image,
//       accounts: {
//         create: {
//           ...profile
//         }
//       }
//     },

//     update: {
//       accounts: {
//         upsert: {
//           where: {
//             provider_userId: {
//               userId: userObj.user.id,
//               provider: profile.provider
//             }
//           },

//           create: {
//             ...profile
//           },

//           update: {
//             ...profile
//           }
//         }
//       }
//     }
//   })


/////////////////////////////////Version 1

// async function setupUserOnboardingV1(userObj, req, res) {
//   return prisma.$transaction(async (tx) => {

//     const profile = {
//       type: userObj.account.type,
//       provider: userObj.account.provider,
//       providerAccountId: userObj.account.providerAccountId,
//       refresh_token: userObj.account.refresh_token,
//       access_token: userObj.account.access_token,
//       expires_at: userObj.account.expires_at,
//       token_type: userObj.account.token_type,
//       scope: userObj.account.scope,
//       id_token: userObj.account.id_token,
//       session_state: userObj.account.session_state,
//     }

//     const userTransaction = await tx.user.upsert({
//       where: {
//         email: userObj.user.email
//       },

//       create: {
//         name: userObj.user.name,
//         email: userObj.user.email,
//         emailVerified: userObj.user.emailVerified,
//         image: userObj.user.image,
//         accounts: {
//           create: {
//             ...profile
//           }
//         }
//       },

//       update: {
//         accounts: {
//           upsert: {
//             where: {
//               provider_userId: {
//                 userId: userObj.user.id,
//                 provider: profile.provider
//               }
//             },

//             create: {
//               ...profile
//             },

//             update: {
//               ...profile
//             }
//           }
//         }
//       }
//     })

//     console.log("Upsert result: ", userTransaction)
//     return userTransaction
//     // const account = await tx.account.upsert({
//     //   where: {
//     //     userId: userObj.user.id
//     //   },
//     //   update: {
//     //     type: userObj.account.type,
//     //     provider: userObj.account.provider,
//     //     providerAccountId: userObj.account.providerAccountId,
//     //     refresh_token: userObj.account.refresh_token,
//     //     access_token: userObj.account.access_token,
//     //     expires_at: userObj.account.expires_at,
//     //     token_type: userObj.account.token_type,
//     //     scope: userObj.account.scope,
//     //     id_token: userObj.account.id_token,
//     //     session_state: userObj.account.session_state
//     //   },
//     //   create: {
//     //     type: userObj.account.type,
//     //     provider: userObj.account.provider,
//     //     providerAccountId: userObj.account.providerAccountId,
//     //     refresh_token: userObj.account.refresh_token,
//     //     access_token: userObj.account.access_token,
//     //     expires_at: userObj.account.expires_at,
//     //     token_type: userObj.account.token_type,
//     //     scope: userObj.account.scope,
//     //     id_token: userObj.account.id_token,
//     //     session_state: userObj.account.session_state,
//     //     user: {
//     //       ...userObj.user
//     //     }
//     //   }
//     // })

//     // const userByAccount = await getUserByAccount({
//     //   providerAccountId: account.providerAccountId,
//     //   provider: account.provider,
//     // })

//     // const newUser = await prismaAdapter.createUser(obj.user)

//     // return await prismaAdapter.linkAccount({ ...obj.account, userId: newUser.id })
//   }).then(result => {
//     console.log("Setting cookie")
//     const token = jwt.sign({data: result.id }, process.env.NEXTAUTH_SECRET, { expiresIn: '1h' });
//     setCookie(NEW_USER_COOKIE, token, { req, res })
//    // console.log("Set the cookie?")
//     // console.log("obj: ", userObj)

//     // const token = jwt.sign({data: userObj.user.id }, process.env.NEXTAUTH_SECRET, { expiresIn: '1h' });
//     // setCookie(NEW_USER_COOKIE, token, { req, res })
//   })
