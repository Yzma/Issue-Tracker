import NextAuth from "next-auth"

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
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
    async session({ session, token, user }) {
      console.log('callback session')
      console.log('session', session)
      console.log('token', token)
      console.log('user', user)
      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken
      // session.user.id = token.id
      
      return session
    }
  },

  // createUser  {
  //   user: {
  //     id: 'clfbg5ec20000qqm85dngy4ww',
  //     name: 'Andrew Caruso',
  //     email: 'andrew.caruso03@gmail.com',
  //     emailVerified: null,
  //     image: 'https://lh3.googleusercontent.com/a/AGNmyxYbCLK6bsg6MjnwlAdlrQL0uH_wTLbjbNpfNNsJ=s96-c'
  //   }
  // }

  events: {
    async createUser(message) {
      console.log('createUser ', message)
      await prisma.userSettings.create({
        data: {
          userId: message.user.id
        },
      });
    },
  },
}

export default NextAuth(authOptions)
