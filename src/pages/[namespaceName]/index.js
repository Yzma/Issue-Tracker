import Head from "next/head"

import layoutStyles from "@/styles/usersLayout.module.css"
import Header from "@/components/Header"

import Footer from "@/components/Footer"
import prisma from "@/lib/prisma/prisma"

import { useSession } from "next-auth/react"

import UserPage from "@/components/namespace/UserPage"
import OrganizationPage from "@/components/namespace/OrganizationPage"

export default function UserProfile(props) {
  console.log(props)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        {props.type === "User" ? (
          <UserPage props={props} />
        ) : (
          <OrganizationPage props={props} />
        )}
        <Footer />
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { namespaceName } = context.query

  const namespace = await prisma.namespace.findUnique({
    where: {
      name: namespaceName
    },

    select: {
      id: true,
      name: true,
      userId: true,
      organizationId: true,

      projects: true,
      members: {
        select: {
          id: true,
          role: true,
          createdAt: true,
          user: {
            select: {
              username: true
            }
          }
        }
      }
    }
  })

  if (!namespace) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    }
  }

  let result

  if (namespace.userId) {
    result = await prisma.user.findUnique({
      where: {
        username: namespaceName
      }
    })
  } else {
    result = await prisma.organization.findUnique({
      where: {
        name: namespaceName
      },

      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  console.log("namespace", namespace)
  console.log("res", result)

  const mappedNamespace = {
    ...namespace,
    projects: namespace.projects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    })),
    members: namespace.members.map((member) => ({
      ...member,
      createdAt: member.createdAt.toISOString()
    }))
  }

  const mappedEntity = {
    ...result,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString()
  }

  return {
    props: {
      type: namespace.userId ? "User" : "Organization",
      namespace: mappedNamespace,
      data: mappedEntity
    }
  }
}
