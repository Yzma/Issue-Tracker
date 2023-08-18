import Head from 'next/head'

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { getProjectLayout } from '@/components/layout/project/ProjectLayout'
import { getProjectServerSideProps } from '@/lib/layout/projects'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type Label = {
  name: string
  color: string
  description: string
}

export const columns: ColumnDef<Label>[] = [
  {
    accessorKey: 'index',
    header: '#',
    cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    size: 1,
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="capitalize">
        <Badge
          style={{
            color: 'white',
            background: `#${row.original.color}`,
          }}
        >
          {row.original.name}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    cell: ({ row }) => (
      <div className="capitalize">{row.original.description}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => {
      return <div className="w-2" />
    },
    cell: () => {
      return (
        <div className="flex justify-end space-x-2">
          <Button size="sm">Edit</Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      )
    },
  },
]

export default function ProjectLabels({
  projectName,
  namespaceName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const labelsQuery = trpc.projects.getLabels.useQuery({
    name: projectName,
    owner: namespaceName,
  })
  const table = useReactTable({
    data: labelsQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  console.log('data: ', labelsQuery.data)
  return (
    <>
      <Head>
        <title>{projectName} Labels</title>
      </Head>

      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            className="w-1/3"
            type="search"
            placeholder="Search for an issue"
          />

          <Button asChild>
            <div className="hover:cursor-pointer">
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              <span>New Label</span>
            </div>
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Labels ({labelsQuery.data?.length})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* eslint-disable-next-line no-nested-ternary */}
              {labelsQuery.isLoading ? (
                <>
                  <TableRow>
                    <TableCell colSpan={0} className="h-24 text-center">
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={0} className="h-24 text-center">
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={0} className="h-24 text-center">
                      <div className="flex flex-row h-20 justify-between items-center">
                        <Skeleton className="h-12 mx-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                  <TableCell colSpan={0} className="h-24 text-center">
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

ProjectLabels.getLayout = function getLayout(
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) {
  return getProjectLayout({
    page,
    namespaceName: page.props.namespaceName,
    projectName: page.props.projectName,
  })
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getProjectServerSideProps(context)
}
