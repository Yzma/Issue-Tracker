import { GetServerSidePropsContext } from 'next'
import ssrHelper from '../trpc/ssrHelper'

// TODO: This could be moved once we change the context creation
export async function getProjectServerSideProps(
  context: GetServerSidePropsContext
) {
  const namespaceName = context.params?.namespaceName
  const projectName = context.params?.projectName

  if (
    namespaceName === undefined ||
    typeof namespaceName !== 'string' ||
    projectName === undefined ||
    typeof projectName !== 'string'
  )
    throw new Error('no slug')

  const helpers = await ssrHelper(context)
  return helpers.projects.getProject
    .fetch({
      name: projectName,
      owner: namespaceName,
    })
    .then(() => {
      return {
        props: {
          trpcState: helpers.dehydrate(),
          namespaceName,
          projectName,
        },
      }
    })
    .catch(() => {
      return {
        notFound: true,
      }
    })
}
