import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import moment from 'moment/moment'
import { MoreHorizontal } from 'lucide-react'
import {
  ColumnDef,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RouterOutputs, trpc } from '@/lib/trpc/trpc'
import { GetElementType } from '@/types/types'
import { Skeleton } from '@/components/ui/skeleton'

type Invite = GetElementType<RouterOutputs['users']['getInvites']>

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: 'index',
    header: '#',
    cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
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
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
      return (
        <div className="capitalize">
          <Link
            className="text-blue-500 hover:text-blue-900 hover:cursor-pointer hover:underline pr-1"
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            href={`/${row.original.inviteeUser?.username}`}
          >
            {row.original.inviteeUser?.username}
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
  {
    id: 'actions',
    enableHiding: false,
    header: () => {
      return <div className="w-2" />
    },
    cell: () => {
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
  const getInvitesQuery = trpc.users.getInvites.useQuery()
  const table = useReactTable({
    data: getInvitesQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <Head>
        <title>My Invites</title>
      </Head>
      <div className="w-full">
        <div className="flex items-center py-4">
          <p className="font-bold text-3xl">My Invites</p>
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
              {/* eslint-disable-next-line no-nested-ternary */}
              {getInvitesQuery.isLoading ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ) : table.getRowModel().rows?.length ? (
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
