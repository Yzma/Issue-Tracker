
import { getServerSession as nextAuthGetServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"

export const getServerSession = (req: NextApiRequest, res: NextApiResponse) => {
  return nextAuthGetServerSession(req, res, authOptions(req, res))
}
