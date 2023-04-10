import Head from "next/head"

import Header from "@/components/Header"
import prisma from "@/lib/prisma/prisma"

import UserPage from "@/components/namespace/UserPage"
import OrganizationPage from "@/components/namespace/OrganizationPage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug } from "@fortawesome/free-solid-svg-icons"

export default function UserProfile(props) {
  console.log(props)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header />
            {props.type === "User" ? (
              <UserPage props={props} />
            ) : (
              <OrganizationPage props={props} />
            )}
            <div className="fixed inset-x-0 bottom-0 flex justify-center items-center pb-4">
              <div className="text-center">
                <FontAwesomeIcon icon={faBug} />
                <p className="mt-2">Bug-Zapper</p>
              </div>
            </div>
          </div>
        </div>
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
      organizationId: true
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
    // TODO: Fetch the users organizations that their apart of
    result = await prisma.user.findUnique({
      where: {
        username: namespaceName
      },

      select: {
        username: true,
        bio: true,
        socialLink1: true,
        socialLink2: true,
        socialLink3: true,
        socialLink4: true,
        members: {
          select: {
            organization: true,
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                private: true,
                createdAt: true,
                updatedAt: true,
                namespace: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // "members":[{"organization":{"id":"clfn0qqoe000vqqic0xsfp94y","name":"AliceOrg","createdAt":"2023-03-24T20:52:30.735Z","updatedAt":"2023-03-24T20:52:30.735Z","userId":"clfn0qqnp0000qqicwa8qulku"}}]}

    console.log("resss", JSON.stringify(result))
    console.log(result.members)
    // result = {
    //   ...result,
    //   members: result.members.map((member) => ({
    //     ...member,
    //     organization: {
    //       ...member.organization,
    //       createdAt: member.organization.createdAt.toISOString(),
    //       updatedAt: member.organization.createdAt.toISOString()
    //     }
    //   }))
    // }
  } else {
    result = await prisma.organization.findUnique({
      where: {
        name: namespaceName
      },

      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        namespace: {
          select: {
            projects: {
              select: {
                id: true,
                name: true,
                description: true,
                private: true,
                createdAt: true,
                updatedAt: true,
                namespace: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
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

  //   result = {
  //     ...result,
  //     members: result.members.map((member) => ({
  //       ...member,
  //       createdAt: member.createdAt.toISOString()
  //     }))
  //   }
  }

  console.log("namespace", namespace)
  console.log("res", result)


  return {
    props: {
      type: namespace.userId ? "User" : "Organization",
      namespace: JSON.parse(JSON.stringify(namespace)),
      data: JSON.parse(JSON.stringify(result))
    }
  }
}
