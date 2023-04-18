
import { getServerSession as nextAuthGetServerSession } from "next-auth/next"
import { Context, authOptions } from "@/pages/api/auth/[...nextauth]"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"

export const getServerSession = (req: NextApiRequest, res: NextApiResponse) => {
  return nextAuthGetServerSession(req, res, authOptions({req, res}))
}

export const getServerSideSession = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  return nextAuthGetServerSession(context.req, context.res, authOptions({context}))
}
