import { useState } from 'react'
import Head from 'next/head'

import { useSession } from 'next-auth/react'

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { OrganizationRole } from '@prisma/client'

import { getProjectServerSideProps } from '@/lib/layout/projects'
import { getProjectMembersLayout } from '@/components/layout/project/ProjectMembersLayout'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'

export default function ProjectMembers({
  namespaceName,
  projectName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  const [open, setOpen] = useState(false)

  // const removeMember = (memberId: string) => {
  //   console.log('removing ', memberId)
  //   axios
  //     .delete(`/api/${namespaceName}/${projectName}/members`, {
  //       data: {
  //         memberId,
  //       },
  //     })
  //     .then((response) => {
  //       console.log('RESPONSE:', response)
  //       // TODO: Redirect to new project page
  //       // router.push("/")
  //     })
  //     .catch((error) => {
  //       console.log('ERROR:', error)
  //     })
  // }

  return (
    <>
      <Head>
        <title>{projectName} Members</title>
      </Head>

      {/* <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to remove {open.name} from the project?
            </Dialog.Description>
            <div
              className="gap-2"
              style={{
                display: 'flex',
                marginTop: 25,
                justifyContent: 'flex-end',
              }}
            >
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => removeMember(open.id)}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex h-screen overflow-hidden bg-slate-100">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <ProjectBelowNavbar
            namespaceName={namespaceName}
            projectName={projectName}
            selected="members"
          />

          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                    Project Members
                  </h1>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
                <header className="px-5 py-4">
                  <h2 className="font-semibold text-slate-800">
                    {projectName} Members ({data.length}){' '}
                  </h2>
                </header>

                <div>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full rounded-xl shadow-lg">
                      <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">#</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold">User</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold">Join Date</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold">Role</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <span className="sr-only">Menu</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-200">
                        {data.map((member, index) => (
                          <tr key={member.id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-left">{index + 1}</div>
                            </td>

                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-center">
                                <Link
                                  className="text-sky-400 hover:text-sky-700"
                                  href={`/${member.user.username}`}
                                >
                                  {member.user.username}
                                </Link>
                                {session &&
                                  session.user.username ===
                                    member.user.username && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-500 bg-green-100 rounded-full">
                                      You
                                    </span>
                                  )}
                              </div>
                            </td>

                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-center">
                                {moment(member.createdAt).format('MMM Do YY')}
                              </div>
                            </td>

                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-center">{member.role}</div>
                            </td>

                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                  <svg
                                    className="w-8 h-8 fill-current "
                                    viewBox="0 0 32 32"
                                  >
                                    <circle cx="16" cy="16" r="2" />
                                    <circle cx="10" cy="16" r="2" />
                                    <circle cx="22" cy="16" r="2" />
                                  </svg>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                  <DropdownMenu.Content
                                    className="DropdownMenuContent"
                                    sideOffset={5}
                                  >
                                    <DropdownMenu.Item
                                      className="DropdownMenuItem"
                                      onClick={() =>
                                        setOpen({
                                          id: member.id,
                                          name: member.user.username,
                                        })
                                      }
                                    >
                                      Remove User
                                      <div className="RightSlot" />
                                    </DropdownMenu.Item>
                                  </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                              </DropdownMenu.Root>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div> */}
    </>
  )
}

ProjectMembers.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getProjectMembersLayout({
    page,
    namespaceName: page.props.namespaceName,
    projectName: page.props.projectName,
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getProjectServerSideProps(context)
}

type OrganizationMembersProps = {
  id: string
  role: OrganizationRole
  createdAt: Date
  user: {
    id: string
    username: string
  }
}[]

// export const getServerSideProps1: GetServerSideProps<{
//   data: OrganizationMembersProps
// }> = async (context) => {
//   const { namespaceName, projectName } = context.query
//   const members: unknown = await prisma.member.findMany({
//     where: {
//       project: {
//         // @ts-ignore
//         name: projectName,
//         namespace: {
//           // @ts-ignore
//           name: namespaceName,
//         },
//       },
//     },
//     select: {
//       id: true,
//       role: true,
//       createdAt: true,
//       user: {
//         select: {
//           id: true,
//           username: true,
//         },
//       },
//     },
//   })
//   return {
//     props: {
//       data: members as OrganizationMembersProps,
//     },
//   }
// }
