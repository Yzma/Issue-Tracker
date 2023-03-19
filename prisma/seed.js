const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      username: 'Alice',
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      username: 'Bob',
    },
  })

  // return await prisma.organization
  // .create({
  //   data: {
  //     name,
  //     userId: session.user.id,
      // namespace: {
      //   create: {
      //     name
      //   }
      // }
  //   }
  // })

  console.log({ alice, bob })
  console.log()


  // const find = await prisma.organization.findMany({
  //   where: {
  //     name: "3",
  //   },
  // })
  const [deleteOrgs, newOrg] = await prisma.$transaction([
    prisma.organization.deleteMany({ where: { name: 'AliceOrg'} }),
    prisma.organization.create({
      data: { 
        name: 'AliceOrg',
        userId: alice.id,
        namespace: {
          create: {
            name: 'AliceOrg'
          }
        }}
    })
  ])

  console.log("newOrg:")
  console.log(newOrg)
  console.log()

  // NOTE: THIS SHOULD FAIL:

  // const result = await prisma.namespace.update({
  //   where: {
  //     name: 'AliceOrg',
  //   },
  //   data: { 
  //     organizationId: null,
  //   }
  // })

  // console.log("result:")
  // console.log(result)
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