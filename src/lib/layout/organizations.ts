import { GetServerSidePropsContext } from 'next'
import { getCookie } from 'cookies-next'
import ssrHelper from '../trpc/ssrHelper'
import { NEXT_AUTH_SESSION_COOKIE } from '../constants'

export async function getOrganizationServerSideProps(
  context: GetServerSidePropsContext,
  ensureIsMember: boolean
) {
  const organizationName = context.params?.organizationName

  if (organizationName === undefined || typeof organizationName !== 'string')
    throw new Error('no slug')

  // Fast path - if the route is supposed to be protected and the user isn't logged in, no need to fetch
  if (
    ensureIsMember &&
    !getCookie(NEXT_AUTH_SESSION_COOKIE, { req: context.req, res: context.res })
  ) {
    return {
      notFound: true,
    }
  }

  const helpers = await ssrHelper(context)
  return helpers.organizations.getOrganization
    .fetch({
      name: organizationName,
    })
    .then((res) => {
      // If the route is supposed to be protected and the user isn't a member of the organization, return a 404
      if (ensureIsMember && res.members === undefined) {
        return {
          notFound: true,
        }
      }

      return {
        props: {
          trpcState: helpers.dehydrate(),
          organizationName,
        },
      }
    })
    .catch(() => {
      return {
        notFound: true,
      }
    })
}
