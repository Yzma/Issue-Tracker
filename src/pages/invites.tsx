import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faBug } from '@fortawesome/free-solid-svg-icons'

import moment from 'moment/moment'
import * as Dialog from '@radix-ui/react-dialog'

import { useSession } from 'next-auth/react'
import { ArrowUpDown, MoreHorizontal, ChevronDown } from 'lucide-react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getLayout } from '@/components/layout/DefaultLayoutTest'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const paymentData: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
]

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

type InviteType =
  | {
      type: 'organization'
      organizationName: string
    }
  | {
      type: 'project'
      projectName: string
      projectNamespace: string
    }

// type Invite = {
//   id: string
//   name: string
//   role: string
//   createdAt: Date
//   invitedBy: string
// }

// const data: Invite[] = [
//   {
//     id: 'm5gr84i9',
//     type: 'Organization',
//     invitedAt: new Date(),
//     invitedBy: 'Andrew',
//     name: 'Project Name',
//     role: 'ADMIN',
//   },
//   {
//     id: '123',
//     type: 'Project',
//     invitedAt: new Date(),
//     invitedBy: 'Andrew',
//     name: 'Project Name',
//     role: 'ADMIN',
//   },
// ]

/// /
///

// select: {
//   id: true,
//   role: true,
//   createdAt: true,
//   inviteeUser: {
//     select: {
//       username: true
//     }
//   },
//   organization: {
//     select: {
//       name: true
//     }
//   },
//   project: {
//     select: {
//       name: true,
//       namespace: {
//         select: {
//           name: true

type Invite = {
  id: string
  role: string
  createdAt: Date
  inviteeUser: {
    username: string
  }
  organization?: {
    name: string
  }
  project?: {
    name: string
    namespace: {
      name: string
    }
  }
}

const data: Invite[] = [
  {
    id: 'orgId',
    role: 'ADMIN',
    createdAt: new Date(),
    inviteeUser: {
      username: 'Andrew',
    },
    organization: {
      name: 'OrgName',
    },
  },
  {
    id: 'projectId',
    role: 'ADMIN',
    createdAt: new Date(),
    inviteeUser: {
      username: 'Andrew',
    },
    project: {
      name: 'ProjectName',
      namespace: {
        name: 'Max',
      },
    },
  },
]

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: 'index',
    header: '#',
    cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    // accessorFn: (row) => {
    //   return row.type === 'Organization' ? (
    //     <Label>asd</Label>
    //   ) : (
    //     <Label>asd</Label>
    //   )
    // },
    cell: ({ row }) =>
      row.original.organization ? (
        <Badge className="bg-green-400 hover:bg-green-400">Organization</Badge>
      ) : (
        <Badge className="bg-yellow-400 hover:bg-yellow-400">Project</Badge>
      ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    // cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    cell: ({ row }) =>
      row.original.organization ? (
        <Link
          className="text-blue-500 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
          href={`/${row.original.organization.name}`}
        >
          {row.original.organization.name}
        </Link>
      ) : (
        <Link
          className="text-blue-500 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
          href={`/${row.original.project?.namespace.name}/${row.original.project?.name}`}
        >
          {row.original.project?.name}
        </Link>
      ),
  },
  {
    accessorKey: 'invitedBy',
    header: 'Invited By',
    cell: ({ row }) => {
      const value = row.original
      return (
        <div className="capitalize">
          <Link
            className="text-blue-500 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
            href={`/${row.original.inviteeUser.username}`}
          >
            {row.original.inviteeUser.username}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'invitedAt',
    header: 'Invited At',
    accessorFn: (row) => {
      return moment(row.createdAt).format('MMM Do YY')
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('invitedAt')}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  // },
  // {
  //   accessorKey: 'amount',
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue('amount'))

  //     // Format the amount as a dollar amount
  //     const formatted = new Intl.NumberFormat('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     }).format(amount)

  //     return <div className="text-right font-medium">{formatted}</div>
  //   },
  // },
  {
    id: 'actions',
    enableHiding: false,
    header: ({ column }) => {
      return <div className="w-2" />
    },
    cell: ({ row }) => {
      // const payment = row.original
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Accept Invitation</DropdownMenuItem>
              <DropdownMenuItem>Decline Invitation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export default function MyInvites() {
  const { data: session } = useSession()

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <>
      <Head>
        <title>My Invites</title>
      </Head>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            // value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            // onChange={(event) =>
            //   table.getColumn('email')?.setFilterValue(event.target.value)
            // }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to decline this invitation?
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
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => declineInvitation(open.id)}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={openAccept} onOpenChange={setOpenAccept}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Confirmation</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Are you sure you want to accept this invitation?
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
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => acceptInvitation(openAccept.id)}
                >
                  Confirm
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}

      {/* <div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full rounded-xl shadow-lg">
                <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
                  <tr>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">#</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold">Type</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold">Name</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold">Invited By</div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold">Invited At</div>
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
                  {props.invites.map((invite, index) => (
                    <tr key={index}>
                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-left">{index + 1}</div>
                      </td>

                      {invite.organization ? (
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-center">Organization</div>
                        </td>
                      ) : (
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-center">Project</div>
                        </td>
                      )}

                      {invite.organization ? (
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-center">
                            <Link
                              className="text-sky-400 hover:text-sky-700"
                              href={`/${invite.organization.name}`}
                            >
                              {invite.organization.name}
                            </Link>
                          </div>
                        </td>
                      ) : (
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-center">
                            <Link
                              className="text-sky-400 hover:text-sky-700"
                              href={`/${invite.project.namespace.name}/${invite.project.name}`}
                            >
                              {invite.project.name}
                            </Link>
                          </div>
                        </td>
                      )}

                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-center">
                          <Link
                            className="text-sky-400 hover:text-sky-700"
                            href={`/${invite.inviteeUser.username}`}
                          >
                            {invite.inviteeUser.username}
                          </Link>
                        </div>
                      </td>

                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-center">
                          {moment(invite.createdAt).format('MMM Do YY')}
                        </div>
                      </td>

                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="text-center">{invite.role}</div>
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
                                    id: invite.id,
                                  })
                                }
                              >
                                Decline Invitation
                                <div className="RightSlot" />
                              </DropdownMenu.Item>

                              <DropdownMenu.Item
                                className="DropdownMenuItem"
                                onClick={() =>
                                  setOpenAccept({
                                    id: invite.id,
                                  })
                                }
                              >
                                Accept Invitation
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
          </div> */}
    </>
  )
}

MyInvites.getLayout = getLayout

// TODO: Check if user is logged in
// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res)
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   const invites = await prisma.member.findMany({
//     where: {
//       inviteeId: session.user.id,
//     },

//     select: {
//       id: true,
//       role: true,
//       createdAt: true,
//       inviteeUser: {
//         select: {
//           username: true,
//         },
//       },
//       organization: {
//         select: {
//           name: true,
//         },
//       },
//       project: {
//         select: {
//           name: true,
//           namespace: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   if (!invites) {
//     return {
//       props: {
//         invites: [],
//       },
//     }
//   }

//   console.log(invites)

//   const mapped = invites.map((e) => {
//     return {
//       ...e,
//       createdAt: e.createdAt.toISOString(),
//     }
//   })

//   return {
//     props: {
//       invites: mapped,
//     },
//   }
// }
