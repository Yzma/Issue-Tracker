

import { getServerSession as nextAuthGetServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export const getServerSession = (req, res) => {
  return nextAuthGetServerSession(req, res, authOptions(req, res))
}
