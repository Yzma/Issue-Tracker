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
        // console.log("SIGN IN CALLED")
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
        // console.log("session called")
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
  }
}

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions(req, res))
}
