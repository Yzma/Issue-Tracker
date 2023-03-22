import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "@/lib/sessions"

import { CommentCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {

    const { namespaceName, projectName } = req.query
    const { description, issueId } = req.body

    let schemaResult
    try {
      schemaResult = await CommentCreationSchema.validate({
        description,
      })
    } catch (e) {
      console.log("Invalid arguments for issue creation: ", e)
      return res.status(400).json({ error: "Invalid arguments" })
    }

    console.log("schemaResult", schemaResult)

    const session = await getServerSession(req, res)
    if (!session) {
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    const foundNamespace = await prisma.namespace.findUnique({
      where: {
        name: namespaceName
      }
    })

    if (!foundNamespace) {
      return res.status(400).json({ error: "Not a valid namespace" })
    }

    console.log("foundNamespace: ", foundNamespace)

    const foundProject = await prisma.project.findMany({
      where: {
        name: projectName
      }
    })

    if (!foundProject) {
      return res.status(400).json({ error: "Not a valid project" })
    }

    const foundIssue = await prisma.issue.findMany({
      where: {
        id: issueId
      }
    })

    if (!foundIssue) {
      return res.status(400).json({ error: "Not a valid issue" })
    }

    console.log("foundIssue: ", foundIssue)

    return await prisma.comment
      .create({
        data: {
          description,
          userId: session.user.id,
          issueId: foundIssue[0].id
        }
      })
      .then((result) => {
        console.log("API RESULT: ", result)
        return res.status(200).json({ result: result })
      })
      .catch((err) => {
        // TODO: Check individual error codes from prisma. Check if the name already exists, if the user already has a namespace, etc
        console.log("error: ", err)
        return res
          .status(400)
          .json({ error: "Error creating entry in database" })
      })
  } else {
    res.json({ error: "Not supported" })
  }
}
