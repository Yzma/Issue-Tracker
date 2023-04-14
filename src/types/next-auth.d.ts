import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {

  interface Session extends DefaultSession {
    user: User
  }

  interface User {
    id: string
    username: string
    namespace: {
      id: string
      name: string
    } 
  }
}
