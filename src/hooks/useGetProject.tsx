import { trpc } from '@/lib/trpc/trpc'

type GetProjects = {
  owner: string
  name: string
}

export function useGetProject({ name, owner }: GetProjects) {
  const getProjectQuery = trpc.projects.getProject.useQuery({
    owner,
    name,
  })

  return getProjectQuery
}
