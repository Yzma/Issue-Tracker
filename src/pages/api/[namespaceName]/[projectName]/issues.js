import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "@/lib/sessions"

import { IssueCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namespaceName, projectName } = req.query
    const { name, description, labels } = req.body

    let schemaResult
    try {
      schemaResult = await IssueCreationSchema.validate({
        name,
        description,
        labels
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

    if (foundNamespace.userId) {
      // TODO: Look to improve readability here
      if (foundNamespace.userId != session.user.id) {
        return res
          .status(400)
          .json({ error: "User is not who they say they are" })
      }
    } else if (foundNamespace.organizationId) {
      const foundOrganizationMember =
        await prisma.organizationMember.findUnique({
          where: {
            userId_organizationId: {
              userId: session.user.id,
              organizationId: foundNamespace.organizationId
            }
          }
        })

      if (!foundOrganizationMember) {
        return res.status(400).json({ error: "Not in the organization" })
      }

      console.log("foundOrganizationMember", foundOrganizationMember)

      if (foundOrganizationMember.role != "Owner") {
        return res.status(400).json({ error: "User isn't an owner" })
      }
    } else {
      // Note: There is a constraint on the database top not allow this to happen so this check will probably be removed in the future
      console.log("ERROR: Namespace does not have a user or and organization")
      return res.status(400).json({ error: "Debug: This should never happen" })
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

    console.log("foundProject: ", foundProject)

    const mapped = labels.map((e) => {
      return {
        id: e
      }
    })

    return await prisma.issue
      .create({
        data: {
          name,
          description,
          userId: session.user.id,
          projectId: foundProject[0].id,
          labels: {
            connect: mapped
          }
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
  } else if (req.method === "DELETE") {
    const { issueId } = req.body

    // TODO:
    // Validate, check if it's the owner

    return await prisma.issue
      .delete({
        where: {
          id: issueId
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
  } else if (req.method === "PUT") {
    const { name, description, open, labels, pinned, issueId } = req.body

    // TODO:
    // Validate, check if it's the owner

    console.log(req.body)

    return await prisma.issue
      .update({
        where: {
          id: issueId
        },
        data: {
          name,
          description,
          open,
          pinned,
          labels: {
            set: labels
          }
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
