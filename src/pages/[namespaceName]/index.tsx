import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import UserPage from '@/components/namespace/UserPage'
import ssrHelper from '@/lib/trpc/ssrHelper'
import OrganizationPage from '@/components/namespace/OrganizationPage'
import { getOrganizationLayout } from '@/components/layout/organization/OrganizationLayout'
import { getLayout as getDefaultLayout } from '@/components/layout/DefaultLayout'

export type SSRHelperReturnType = Awaited<ReturnType<typeof ssrHelper>>
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

// This page is special since its the only one that conditions fetches and renders the page depending if it's a User or an Organization.
// NextJS does'nt support being able to call "next" on a route, unlike something like ExpressJS, so were stuck with these if statements.
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const namespaceName = context.params?.namespaceName

  if (namespaceName === undefined || typeof namespaceName !== 'string')
    throw new Error('no slug')

  const helpers = await ssrHelper(context)

  // TODO: Rename getNamespaceTEST
  // TODO: Do we even need to call getNamespace: Technically no, we can just fetch getUser first, if thats not found, fetch getOrganization. And if that isn't found, then 404.
  return helpers.namespace.getNamespaceTEST
    .fetch({
      name: namespaceName,
    })
    .then(async (res) => {
      if (res.userId) {
        // User
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
          .catch(() => {
            return {
              notFound: true,
            }
          })
      }

      // Organization
      // TODO: Rename getOrganizationLayout
      return helpers.organizations.getOrganization
        .fetch({
          name: namespaceName,
        })
        .then(() => {
          return {
            props: {
              trpcState: helpers.dehydrate(),
              namespaceName,
              type: 'Organization',
            },
          }
        })
        .catch(() => {
          return {
            notFound: true,
          }
        })
    })
    .catch(() => {
      return {
        notFound: true,
      }
    })
}
