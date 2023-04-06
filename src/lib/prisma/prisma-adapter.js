import { PrismaAdapter } from "@next-auth/prisma-adapter"

export default function CustomPrismaAdapter(p) {
  return {
    ...PrismaAdapter(p),

    createUser: (data) => {
      return p.user.create({
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

    linkAccount: (data) => {
      return p.account.create({ data })
    },

    getUser: (id) =>
      p.user.findUnique({
        where: { id },
        include: {
          namespace: true
        }
      }),

    getUserByEmail: (email) =>
      p.user.findUnique({
        where: { email },
        include: {
          namespace: true
        }
      }),

    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
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

    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
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
