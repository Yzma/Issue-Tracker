import Head from "next/head";

import layoutStyles from "@/styles/usersLayout.module.css";
import Header from "@/components/Header";
import prisma from "@/lib/prisma/prisma";

import { useSession } from "next-auth/react";

import UserPage from "@/components/namespace/UserPage";
import OrganizationPage from "@/components/namespace/OrganizationPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

export default function UserProfile(props) {
  console.log(props);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        {props.type === "User" ? (
          <UserPage props={props} />
        ) : (
          <OrganizationPage props={props} />
        )}
      </main>
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center pb-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faBug} />
          <p className="mt-2">Bug-Zapper</p>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { namespaceName } = context.query;

  const namespace = await prisma.namespace.findUnique({
    where: {
      name: namespaceName,
    },

    select: {
      id: true,
      name: true,
      userId: true,
      organizationId: true,
      projects: true,
    },
  });

  if (!namespace) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  let result;

  if (namespace.userId) {
    // TODO: Fetch the users organizations that their apart of
    result = await prisma.user.findUnique({
      where: {
        username: namespaceName
      },

      select: {
        username: true,
        members: {
          where: {
            project: null
          },

          select: {
            organization: true
          }
        }
      }
    })

    // "members":[{"organization":{"id":"clfn0qqoe000vqqic0xsfp94y","name":"AliceOrg","createdAt":"2023-03-24T20:52:30.735Z","updatedAt":"2023-03-24T20:52:30.735Z","userId":"clfn0qqnp0000qqicwa8qulku"}}]}

    console.log("resss", JSON.stringify(result))
    console.log(result.members)
    result = {
      ...result,
      members: result.members.map((member) => ({
        ...member,
        organization: {
          ...member.organization,
          createdAt: member.organization.createdAt.toISOString(),
          updatedAt: member.organization.createdAt.toISOString()
        }
      }))
    }

  } else {
    result = await prisma.organization.findUnique({
      where: {
        name: namespaceName,
      },

      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    result = {
      ...result,
      members: result.members.map((member) => ({
        ...member,
        createdAt: member.createdAt.toISOString(),
      })),
    };
  }

  console.log("namespace", namespace);
  console.log("res", result);

  const mappedNamespace = {
    ...namespace,
    projects: namespace.projects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })),
  };

  return {
    props: {
      type: namespace.userId ? "User" : "Organization",
      namespace: JSON.parse(JSON.stringify(namespace)),
      data: JSON.parse(JSON.stringify(result))
    },
  };
}