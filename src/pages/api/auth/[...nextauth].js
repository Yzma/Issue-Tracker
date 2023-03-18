import NextAuth from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import CustomPrismaAdapter from "@/lib/prisma/prisma-adapter"
import prisma from "@/lib/prisma/prisma"

import { setCookie } from 'cookies-next';

import * as jose from 'jose'
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

//https://next-auth.js.org/configuration/callbacks#jwt-callback - at the bottom of the page
// The session object is not persisted server side, even when using database sessions - only data such as the session token, the user, and the expiry time is stored in the session table.

// If you need to persist session data server side, you can use the accessToken returned for the session as a key - and connect to the database in the session() callback to access it. Session accessToken values do not rotate and are valid as long as the session is valid.

// If using JSON Web Tokens instead of database sessions, you should use the User ID or a unique key stored in the token (you will need to generate a key for this yourself on sign in, as access tokens for sessions are not generated when using JSON Web Tokens).

// export const authOptions = {
//   adapter: CustomPrismaAdapter(prisma),
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code"
//         }
//       }
//     })
//   ],

//   callbacks: {
//     async session({ session, token, user }) {
//       console.log("session called")

//       session.user.id = user.id
//       session.namespace = user.namespace?.name

//       return session
//     }
//   },
// }

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
        console.log("SIGN IN CALLED")
        // console.log("user", user)
        // console.log("account", account)
        // console.log("profile", profile)
        // console.log("email", email)
        // console.log("credentials", credentials)

        // FIRST TIME LOGIN
        if (!user.namespace) {
          console.log("SET COOKIE")
          // TODO: Encrypt this
          setCookie(process.env.NEW_USER_COOKIE, user.id, { req, res, maxAge: 60 * 6 * 24 })
          return { redirect: '/finish', stayLoggedIn: true }
        }
   
        return { redirect: `/${user.namespace.name}`, stayLoggedIn: true }
      },

      async session({ session, token, user }) {
        console.log("session called")
        // console.log(" ")
        // console.log('callback session')
        // console.log('session', session)
        // console.log('token', token)
        // console.log('user', user)

        session.user.id = user.id
        session.namespace = user.namespace?.name

        // session.user.settings = {
        //   colorScheme: user.settings.colorScheme
        // }

        return session
      }
    },

    events: {
      async createUser(message) {
        console.log('CREATE USER')
      },

      async signIn(message) {
        console.log('signIn called')
        // console.log(message)
        // return res.redirect("/somewherer")
      }
    }
  }
}

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions(req, res))
}

// export default async function auth(req, res) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   console.log("Path: ", res.nextUrl)
//   const test = NextAuth(req, res, {
//     adapter: CustomPrismaAdapter(prisma),
//     providers: [
//       GitHubProvider({
//         clientId: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET
//       }),
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         authorization: {
//           params: {
//             prompt: "consent",
//             access_type: "offline",
//             response_type: "code"
//           }
//         }
//       })
//     ],

//     /*
//         SIGN IN FLOW:
    
//         1. User signs in with Google or Github
//         2.
//           1. If the user created a username (fetch database)
//             - Allow the login and redirect to user profile
//           2. If the user has not created a username:
//             - Deny the login
//             - Assign a JWT token (cookie) to allow the user to submit a username UNDER the newly created account
//       */

//     callbacks: {
//       async signIn({ user, account, profile, email, credentials }) {
//         console.log("SIGN IN CALLED")
//         // console.log("user", user)
//         // console.log("account", account)
//         // console.log("profile", profile)
//         // console.log("email", email)
//         // console.log("credentials", credentials)

//         // FIRST TIME LOGIN
//         if (!user.namespace) {
//           console.log("SET COOKIE")
//           // TODO: Encrypt this
//           setCookie(process.env.NEW_USER_COOKIE, user.id, { req, res, maxAge: 60 * 6 * 24 })
//           return { redirect: '/finish', stayLoggedIn: true }
//         }
   
//         return { redirect: `/${user.namespace.name}`, stayLoggedIn: true }
//       },

//       async session({ session, token, user }) {
//         console.log("session called")
//         // console.log(" ")
//         // console.log('callback session')
//         // console.log('session', session)
//         // console.log('token', token)
//         // console.log('user', user)

//         session.user.id = user.id
//         session.namespace = user.namespace?.name

//         // session.user.settings = {
//         //   colorScheme: user.settings.colorScheme
//         // }

//         return session
//       }
//     },

//     events: {
//       async createUser(message) {
//         console.log('CREATE USER')
//       },

//       async signIn(message) {
//         console.log('signIn called')
//         // console.log(message)
//         // return res.redirect("/somewherer")
//       }
//     }
//   })

//   return await test
// }

// export default NextAuth(authOptions)

// export default async function auth(req, res) {

//   return await NextAuth(req, res, {
//     adapter: CustomPrismaAdapter(prisma),
//     providers: [
//       GitHubProvider({
//         clientId: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET
//       }),
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         authorization: {
//           params: {
//             prompt: "consent",
//             access_type: "offline",
//             response_type: "code"
//           }
//         }
//       })
//     ],

//     callbacks: {
//       async signIn({ user, account, profile, email, credentials }) {
//         console.log('SIGN IN CALLED')
//         console.log('user', user)
//         console.log('account', account)
//         console.log('profile', profile)
//         console.log('email', email)
//         console.log('credentials', credentials)

//         // FIRST TIME LOGIN
//         if(!user.namespace) {
//           return '/'
//         } else {
//           // ACCOUNT IS SETUP
//         }

//         return true
//       },
//       async session({ session, token, user }) {
//         console.log('session called')
//         // console.log(" ")
//         // console.log('callback session')
//         // console.log('session', session)
//         // console.log('token', token)
//         // console.log('user', user)
//         // console.log(" ")

//         session.user.id = user.id
//         session.namespace = user.namespace.name

//         if(user.namespace) {

//         }
//         // session.user.settings = {
//         //   colorScheme: user.settings.colorScheme
//         // }

//         return session
//       },

//       async jwt({ token, account, profile }) {
//         // Persist the OAuth access_token and or the user id to the token right after signin
//         console.log('JWT CALLBACK')
//         console.log('token', token)
//         console.log('account', account)
//         console.log('profile', profile)
//         // if (account) {
//         //   token.accessToken = account.access_token
//         //   token.id = profile.id
//         // }
//         return token
//       }
//     },
//   })
// }

// export const authOptions = {
//   adapter: CustomPrismaAdapter(prisma),
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code"
//         }
//       }
//     })
//   ],

//   // session: {
//   //   strategy: "jwt",
//   // },

//   // session {
//   //   user: {
//   //     name: 'Andrew Caruso',
//   //     email: 'andrew.caruso03@gmail.com',
//   //     image: 'https://lh3.googleusercontent.com/a/AGNmyxYbCLK6bsg6MjnwlAdlrQL0uH_wTLbjbNpfNNsJ=s96-c'
//   //   },
//   //   expires: '2023-04-16T03:47:34.222Z'
//   // }
//   // token {
//   //   name: 'Andrew Caruso',
//   //   email: 'andrew.caruso03@gmail.com',
//   //   picture: 'https://lh3.googleusercontent.com/a/AGNmyxYbCLK6bsg6MjnwlAdlrQL0uH_wTLbjbNpfNNsJ=s96-c',
//   //   sub: 'clfbzwobb0000qqhcjqssap4d',
//   //   iat: 1679024620,
//   //   exp: 1681616620,
//   //   jti: 'd8b8d734-301e-4dda-939b-236b0698990b'
//   // }

//   callbacks: {
//     async session({ session, token, user }) {
//       // console.log(" ")
//       // console.log('callback session')
//       // console.log('session', session)
//       // console.log('token', token)
//       // console.log('user', user)
//       // console.log(" ")

//       session.user.id = user.id
//       session.namespace = user.namespace
//       session.user.settings = {
//         colorScheme: user.settings.colorScheme
//       }

//       return session
//     }
//   },
// }

// export default NextAuth(authOptions)
