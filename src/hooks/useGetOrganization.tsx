import { trpc } from '@/lib/trpc/trpc'

type GetOrganization = {
  name: string
}

export function useGetOrganization({ name }: GetOrganization) {
  const getOrganization = trpc.organizations.getOrganization.useQuery({
    name,
  })

  return getOrganization
}
