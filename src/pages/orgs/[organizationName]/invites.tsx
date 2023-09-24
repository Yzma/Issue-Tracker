import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc/trpc'
import { getOrganizationServerSideProps } from '@/lib/layout/organizations'
import { getOrganizationMembersLayout } from '@/components/layout/organization/OrganizationMembersLayout'
import { Input } from '@/components/ui/input'
import { InviteMemberDialog } from '@/components/dialog/InviteMemberDialog'

export default function OrganizationMemberInvites({
  organizationName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()
  const organizationOutgoingInvitesQuery =
    trpc.organizations.getOutgoingInvites.useQuery({
      name: organizationName,
    })

  return (
    <>
      <Head>
        <title>Pending Invites</title>
      </Head>
      <div className="space-y-8 lg:flex-row">
        <div className="flex justify-between">
          <Input
            className="w-2/4"
            type="search"
            placeholder="Find a member..."
          />
          <InviteMemberDialog name={organizationName} />
        </div>

        {!organizationOutgoingInvitesQuery.isLoading && (
          <div className="rounded-sm border bg-white">
            <div className="px-5 py-4">
              <h2 className="font-semibold text-slate-800">
                {organizationName} Pending Invites (
                {organizationOutgoingInvitesQuery.data?.length}){' '}
              </h2>
            </div>

            <div>
              <table className="w-full table-auto rounded-xl shadow-lg">
                <thead className="border-t border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                      <div className="text-left font-semibold">#</div>
                    </th>
                    <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                      <div className="font-semibold">User</div>
                    </th>
                    <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                      <div className="font-semibold">Join Date</div>
                    </th>
                    <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                      <div className="font-semibold">Role</div>
                    </th>
                    <th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                      <span className="sr-only">Menu</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {organizationOutgoingInvitesQuery.data?.map(
                    (member, index) => (
                      <tr key={member.id}>
                        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                          <div className="text-left">{index + 1}</div>
                        </td>

                        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                          <div className="space-x-1 text-center">
                            <Link
                              className="text-sky-400 hover:text-sky-700"
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              href={`/${member.user.username}`}
                            >
                              {member.user.username}
                            </Link>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                          <div className="text-center">
                            {moment(member.acceptedAt).format('MMM Do YY')}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                          <div className="text-center">{member.role}</div>
                        </td>

                        <td className="w-px whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
                          {session &&
                            session.user.username === member.user.username && (
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                  <svg
                                    className="h-8 w-8 fill-current "
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
                                      onClick={
                                        () => { }
                                        // setOpen({
                                        //   id: member.id,
                                        //   name: member.user.username,
                                        // })
                                      }
                                    >
                                      Remove User
                                      <div className="RightSlot" />
                                    </DropdownMenu.Item>
                                  </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                              </DropdownMenu.Root>
                            )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

OrganizationMemberInvites.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getOrganizationMembersLayout({
    page,
    organizationName: page.props.organizationName,
    variant: 'small',
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getOrganizationServerSideProps(context, true)
}
