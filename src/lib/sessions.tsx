import { getServerSession as nextAuthGetServerSession } from 'next-auth/next'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getServerSession = (req: NextApiRequest, res: NextApiResponse) => {
  return nextAuthGetServerSession(req, res, authOptions({ req, res }))
}

export const getServerSideSession = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  return nextAuthGetServerSession(
    context.req,
    context.res,
    authOptions({ context })
  )
}
