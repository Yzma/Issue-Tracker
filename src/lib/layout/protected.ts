import { GetServerSidePropsContext } from 'next'
import { getServerSideSession } from '../sessions'

export async function getProtectedServerSideProps(
  context: GetServerSidePropsContext
) {
  const session = await getServerSideSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
