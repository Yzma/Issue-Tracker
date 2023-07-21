import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import { trpc } from '@/lib/trpc/trpc'
import UserPage from '@/components/namespace/UserPage'
import ssrHelper from '@/lib/trpc/ssrHelper'
import OrganizationPage from '@/components/namespace/OrganizationPage'

export default function NamespaceIndexRoute(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { namespaceName } = props
  const namespaceQuery = trpc.namespaceRouter.getNamespace.useQuery(
    {
      name: namespaceName,
    },
    {
      enabled: false,
    }
  )

  // Unreachable code. Needed for type safety.
  if (namespaceQuery.status !== 'success') {
    return <div />
  }

  return namespaceQuery.data.type === 'User' ? (
    <UserPage data={namespaceQuery.data} />
  ) : (
    <OrganizationPage data={namespaceQuery.data} />
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = ssrHelper(context)
  const namespaceName = context.params?.namespaceName as string

  if (typeof namespaceName !== 'string') throw new Error('no slug')

  await helpers.namespaceRouter.getNamespace.prefetch({ name: namespaceName })

  return {
    props: {
      trpcState: helpers.dehydrate(),
      namespaceName,
    },
  }
}
