const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  // TODO: OrganizationSettings, Comments

  // Clear the database
  await prisma.$queryRaw`TRUNCATE "User", "Account", "Session", "UserSettings", "Organization", "OrganizationMember", "Namespace", "Issue", "OrganizationInvitation", "Comment", "Project", "Label", "_IssueToLabel", "Member";`

  // Users
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      username: "Alice",
      settings: {
        create: {}
      },
      namespace: {
        create: {
          name: "Alice"
        }
      }
    }
  })

  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
      username: "Bob",
      settings: {
        create: {}
      },
      namespace: {
        create: {
          name: "Bob"
        }
      }
    }
  })

  const jim = await prisma.user.upsert({
    where: { email: "jim@prisma.io" },
    update: {},
    create: {
      email: "jim@prisma.io",
      name: "Jim",
      username: "Jim",
      settings: {
        create: {}
      },
      namespace: {
        create: {
          name: "Jim"
        }
      }
    }
  })

  console.log({ alice, bob, jim })
  console.log()

  // Organization with OrganizationMembers
  const [deleteOrgs, aliceOrg] = await prisma.$transaction([
    prisma.organization.deleteMany({ where: { name: "AliceOrg" } }),
    prisma.organization.create({
      data: {
        name: "AliceOrg",
        userId: alice.id,
        organizationMembers: {
          create: [
            { userId: alice.id, role: "Owner" },
            { userId: jim.id, role: "User" }
          ]
        },
        members: {
          create:[
            { userId: alice.id, role: "Owner" },
            { userId: jim.id, role: "User" }
          ]
        },
        namespace: {
          create: {
            name: "AliceOrg"
          }
        }
      }
    })
  ])

  //OrganizationInvitation
  const [deleteInvites, newInvite] = await prisma.$transaction([
    prisma.organizationInvitation.deleteMany({
      where: { organizationId: aliceOrg.id }
    }),
    prisma.organizationInvitation.create({
      data: {
        invitedId: bob.id,
        inviteeId: alice.id,
        organizationId: aliceOrg.id
      }
    })
  ])

  // Get all namespaces
  const [aliceNamespace, bobNamespace, jimNamespace, aliceOrgNamespace] =
    await prisma.$transaction([
      prisma.namespace.findUnique({
        where: {
          name: "Alice"
        }
      }),

      prisma.namespace.findUnique({
        where: {
          name: "Bob"
        }
      }),

      prisma.namespace.findUnique({
        where: {
          name: "Jim"
        }
      }),

      prisma.namespace.findUnique({
        where: {
          name: "AliceOrg"
        }
      })
    ])

  // Projects and Labels
  const aliceProject = await prisma.project.create({
    data: {
      name: "AliceProject",
      description: "Test description",
      private: false,
      namespaceId: aliceNamespace.id,
      labels: {
        create: [
          { name: "Bug", description: "Bug description", color: "rgb" }, // TODO: Change to proper RGB value
          {
            name: "Documentation",
            description: "Documentation description",
            color: "rgb"
          }, // TODO: Change to proper RGB value
          {
            name: "Duplicate",
            description: "Duplicate description",
            color: "rgb"
          } // TODO: Change to proper RGB value
        ]
      }
    }
  })

  const aliceOrgProject = await prisma.project.create({
    data: {
      name: "AliceOrganizationProject",
      description: "Test description",
      private: false,
      namespaceId: aliceOrgNamespace.id,
      labels: {
        create: [
          { name: "Bug", description: "Bug description", color: "rgb" }, // TODO: Change to proper RGB value
          {
            name: "Documentation",
            description: "Documentation description",
            color: "rgb"
          }, // TODO: Change to proper RGB value
          {
            name: "Duplicate",
            description: "Duplicate description",
            color: "rgb"
          } // TODO: Change to proper RGB value
        ]
      }
    }
  })

  const bobProject = await prisma.project.create({
    data: {
      name: "BobProject",
      description: "Test description",
      private: false,
      namespaceId: bobNamespace.id,
      labels: {
        create: [
          { name: "Bug", description: "Bug description", color: "rgb" }, // TODO: Change to proper RGB value
          {
            name: "Documentation",
            description: "Documentation description",
            color: "rgb"
          }, // TODO: Change to proper RGB value
          {
            name: "Duplicate",
            description: "Duplicate description",
            color: "rgb"
          } // TODO: Change to proper RGB value
        ]
      }
    }
  })

  // Issues
  const aliceProjectIssue = await prisma.issue.create({
    data: {
      name: "Title",
      description: `# Title
      Test body`,
      userId: alice.id,
      projectId: aliceProject.id,
      labels: {
        connect: {
          name_projectId: {
            name: "Bug",
            projectId: aliceProject.id
          }
        }
      }
    }
  })

  const aliceProjectIssue2 = await prisma.issue.create({
    data: {
      name: "Title 2",
      description: `# Title
      Test body 2`,
      userId: alice.id,
      projectId: aliceProject.id,
      labels: {
        connect: {
          name_projectId: {
            name: "Documentation",
            projectId: aliceProject.id
          }
        }
      }
    }
  })

  const aliceOrgProjectIssue2 = await prisma.issue.create({
    data: {
      name: "Title 2",
      description: `# Title
      Test body 2`,
      userId: alice.id,
      projectId: aliceOrgProject.id,
      labels: {
        connect: {
          name_projectId: {
            name: "Documentation",
            projectId: aliceOrgProject.id
          }
        }
      }
    }
  })

  console.log("aliceOrg:")
  console.log(aliceOrg)
  console.log()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
