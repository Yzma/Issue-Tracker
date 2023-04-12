import { PrismaClient, Prisma, User, Account, Session } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export default function CustomPrismaAdapter(prismaClient: PrismaClient) {
  return {
    ...PrismaAdapter(prismaClient),

    createUser: (data: Prisma.UserCreateInput) => {
      return prismaClient.user.create({
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
          settings: {
            create: {}
          }
        }
      })
    },

    linkAccount: (data: Prisma.AccountCreateInput) => {
      return prismaClient.account.create({ data })
    },

    getUser: (id: User["id"]) =>
      prismaClient.user.findUnique({
        where: { id },
        include: {
          namespace: true
        }
      }),

    getUserByEmail: (email: User["email"]) =>
      prismaClient.user.findUnique({
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

    async getSessionAndUser(sessionToken: Session["sessionToken"]) {
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
    }
  }
}
