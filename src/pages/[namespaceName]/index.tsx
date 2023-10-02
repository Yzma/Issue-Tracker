import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import UserPage from '@/components/namespace/UserPage'
import ssrHelper from '@/lib/trpc/ssrHelper'
import OrganizationPage from '@/components/namespace/OrganizationPage'
import { getOrganizationLayout } from '@/components/layout/organization/OrganizationLayout'
import { getLayout as getDefaultLayout } from '@/components/layout/DefaultLayout'

export default function NamespaceIndexRoute({
  namespaceName,
  type,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return type === 'User' ? (
    <UserPage username={namespaceName} />
  ) : (
    <OrganizationPage organizationName={namespaceName} />
  )
}

NamespaceIndexRoute.getLayout = (
  page: React.ReactElement<
    InferGetServerSidePropsType<typeof getServerSideProps>
  >
) => {
  if (page.props.type === 'User') {
    return getDefaultLayout(page)
  }

  // Organization pages have a specific layout they must use.
  return getOrganizationLayout({
    page,
    organizationName: page.props.namespaceName,
    variant: 'full',
  })
}

// This page is special because it's the only one that conditionally fetches and renders the page depending on whether it's a User or an Organization.
// Next.js doesn't support the ability to call 'next' on a route, unlike something like Express.js, so we're stuck with these 'if' statements
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const namespaceName = context.params?.namespaceName

  if (namespaceName === undefined || typeof namespaceName !== 'string')
    throw new Error('no slug')

  const helpers = await ssrHelper(context)
  return helpers.users.getUser
    .fetch({
      name: namespaceName,
    })
    .then(() => {
      return {
        props: {
          trpcState: helpers.dehydrate(),
          namespaceName,
          type: 'User',
        },
      }
    })
    .catch(async () => {
      try {
        await helpers.organizations.getOrganization.fetch({
          name: namespaceName,
        })
        return {
          props: {
            trpcState: helpers.dehydrate(),
            namespaceName,
            type: 'Organization',
          },
        }
      } catch {
        return {
          notFound: true,
        }
      }
    })
}
