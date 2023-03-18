import { PrismaAdapter } from "@next-auth/prisma-adapter"

export default function CustomPrismaAdapter(p) {
  return {
    ...PrismaAdapter(p),

    createUser: (data) => {
      const user = p.user.create({ 
        data: {
          ...data,
          settings: {
            create: {}
          }
        }
      })
      // await prisma.namespace.create({
      //   data: {
      //     name: user.id,
      //     user: {
      //       connect: {
      //         id: user.id
      //       }
      //     },
      //   },
      // });
      return user
    },

    getUser: (id) => p.user.findUnique({ 
      where: { id },
      include: {
        settings: true,
        namespace: true
      }
    }),

    getUserByEmail: (email) => p.user.findUnique({ 
      where: { email },
      include: {
        settings: true,
        namespace: true
      }
    }),

    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: {
          user: {
            include: {
              settings: true,
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
              settings: true,
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
