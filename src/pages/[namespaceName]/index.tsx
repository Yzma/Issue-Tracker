import Head from 'next/head'

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Header from '@/components/Header'
import UserPage from '@/components/namespace/UserPage'
import OrganizationPage from '@/components/namespace/OrganizationPage'

import prisma from '@/lib/prisma/prisma'

import { UserProfileProps, OrganizationProps } from '@/types/types'
import { getServerSideSession } from '@/lib/sessions'

type NamespaceProps = UserProfileProps | OrganizationProps

export default function NamespaceIndexRoute({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <main>
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header />
            {data.type === 'User' ? (
              <UserPage data={data} />
            ) : (
              <OrganizationPage data={data} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  data: NamespaceProps
}> = async (context) => {
  const namespaceName = context.query.namespaceName as string

  const session = await getServerSideSession(context)
  const isUserViewingOwnProfile = session?.user?.name === namespaceName

  const namespace = await prisma.namespace.findUnique({
    where: {
      name: namespaceName,
    },

    select: {
      id: true,
      name: true,
      userId: true,
      organizationId: true,
      projects: {
        select: {
          id: true,
          name: true,
          description: true,
          private: isUserViewingOwnProfile,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!namespace) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  if (namespace.userId) {
    const userResponse = await prisma.user.findUnique({
      where: {
        id: namespace.userId,
      },

      select: {
        id: true,
        username: true,
        bio: true,
        socialLink1: true,
        socialLink2: true,
        socialLink3: true,
        socialLink4: true,
        members: {
          where: {
            project: null,
          },
          select: {
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const data: UserProfileProps = {
      type: 'User',
      user: {
        ...userResponse,
      },
      namespace: {
        ...namespace,
      },
      organizations: userResponse.members.map((member) => {
        return {
          name: member.organization.name,
        }
      }),
    }

    return {
      props: {
        data,
      },
    }
  }
  const orgResponse = await prisma.user.findUnique({
    where: {
      id: namespace.organizationId,
    },

    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      members: {
        select: {
          id: true,
          role: true,
          createdAt: true,
          organizationId: true,
          userId: true,
        },
      },
    },
  })

  const data: OrganizationProps = {
    type: 'Organization',
    organization: {
      ...orgResponse,
    },
    namespace: {
      ...namespace,
    },
  }

  return {
    props: {
      data,
    },
  }
}
