/* eslint-disable react/no-unstable-nested-components */
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
import { GetServerSidePropsContext } from 'next'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { getLayout } from '@/components/layout/DefaultLayout'
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
import { getProtectedServerSideProps } from '@/lib/layout/protected'
import { useToast } from '@/components/ui/use-toast'

type Invite = GetElementType<RouterOutputs['users']['getInvites']>

export default function MyInvites() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const invitesQueryKey = getQueryKey(trpc.users.getInvites, undefined, 'query')
  const getInvitesQuery = trpc.users.getInvites.useQuery()
  const acceptInviteMutation = trpc.users.acceptInvite.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: invitesQueryKey,
      })
    },
  })
  const deleteInviteMutation = trpc.users.deleteInvite.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: invitesQueryKey,
      })
    },
  })

  async function acceptInvite(id: string, name: string) {
    return acceptInviteMutation
      .mutateAsync({
        inviteId: id,
      })
      .then(() => {
        toast({
          title: 'Accepted Invitation!',
          description: `You accepted the invitation to join ${name}!`,
        })
      })
  }

  async function declineInvite(id: string, name: string) {
    return deleteInviteMutation
      .mutateAsync({
        inviteId: id,
      })
      .then(() => {
        toast({
          title: 'Declined Invitation!',
          description: `You have declined to join ${name}!`,
        })
      })
  }

  const columns = React.useMemo<ColumnDef<Invite>[]>(
    () => [
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
            <Badge className="bg-green-400 hover:bg-green-400">
              Organization
            </Badge>
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
              className="pr-1 text-blue-500 hover:cursor-pointer hover:text-blue-900 hover:underline"
              href={`/${row.original.organization.name}`}
            >
              {row.original.organization.name}
            </Link>
          ) : (
            <Link
              className="pr-1 text-blue-500 hover:cursor-pointer hover:text-blue-900 hover:underline"
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
                className="pr-1 text-blue-500 hover:cursor-pointer hover:text-blue-900 hover:underline"
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
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue('role')}</div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => {
          return <div className="w-2" />
        },
        cell: ({ row }) => {
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
                  {/* <DropdownMenuItem>Accept Invitation</DropdownMenuItem> */}
                  <DropdownMenuItem
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() =>
                      acceptInvite(
                        row.original.id,
                        row.original.organization
                          ? row.original.organization.name
                          : (row.original.project?.name as string)
                      )
                    }
                  >
                    Accept Invitation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() =>
                      declineInvite(
                        row.original.id,
                        row.original.organization
                          ? row.original.organization.name
                          : (row.original.project?.name as string)
                      )
                    }
                  >
                    Decline Invitation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

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
          <p className="text-3xl font-bold">My Invites</p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {!header.isPlaceholder &&
                          flexRender(
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
                      <div className="flex h-20 flex-row items-center justify-between">
                        <Skeleton className="mx-4 h-12 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex h-20 flex-row items-center justify-between">
                        <Skeleton className="mx-4 h-12 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex h-20 flex-row items-center justify-between">
                        <Skeleton className="mx-4 h-12 w-full" />
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getProtectedServerSideProps(context)
}
