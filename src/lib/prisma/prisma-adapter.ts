import { PrismaClient, Prisma, User, Account, Session, VerificationToken } from '@prisma/client';
import { Adapter, AdapterAccount } from 'next-auth/adapters';
import { PrismaAdapter } from "@next-auth/prisma-adapter"

/** @return { import("next-auth/adapters").Adapter } */
export default function CustomPrismaAdapter(prismaClient: PrismaClient) {
  return {
    ...PrismaAdapter(prismaClient),

    getUser: (id: User["id"]) => prismaClient.user.findUnique({
      where: { id },
      include: {
        namespace: true
      }
    }),

    getUserByEmail: (email: User["email"]) => prismaClient.user.findUnique({
      where: { email },
      include: {
        namespace: true
      }
    }),

    async getUserByAccount(provider_providerAccountId: {
      providerAccountId: Account["providerAccountId"];
      provider: Account["provider"];
    }) {
      const account = await prismaClient.account.findUnique({
        where: { provider_providerAccountId },
        select: {
          user: {
            include: {
              namespace: true
            }
          }
        }
      })
      return account?.user ?? null
    },

    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await prismaClient.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            include: {
              namespace: true
            }
          }
        }
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session }
    },
  }
}
