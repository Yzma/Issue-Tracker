import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import { trpc } from '@/lib/trpc/trpc'
import UserPage from '@/components/namespace/UserPage'
import ssrHelper from '@/lib/trpc/ssrHelper'
import OrganizationPage from '@/components/namespace/OrganizationPage'
import NamespaceNotFound from '@/components/namespace/NamespaceNotFound'

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
      retry: false,
    }
  )

  if (namespaceQuery.status !== 'success') {
    return <NamespaceNotFound />
  }

  return namespaceQuery.data.type === 'User' ? (
    <UserPage data={namespaceQuery.data} />
  ) : (
    <OrganizationPage data={namespaceQuery.data} />
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = await ssrHelper(context)
  const namespaceName = context.params?.namespaceName

  if (namespaceName === undefined || typeof namespaceName !== 'string')
    throw new Error('no slug')

  await helpers.namespaceRouter.getNamespace.prefetch({
    name: namespaceName,
  })

  return {
    props: {
      trpcState: helpers.dehydrate(),
      namespaceName,
    },
  }
}
