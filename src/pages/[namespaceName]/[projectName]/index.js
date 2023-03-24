import Head from "next/head";
import styles from "@/styles/IssueContainer.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IssueList from "@/components/IssueList";
import IssueButtons from "@/components/IssueButtons";
import SearchBar from "@/components/IssueSearchBar";
import { useState } from "react";
import prisma from "@/lib/prisma/prisma";
import { useRouter } from "next/router"
import Link from "next/link";
import { getServerSession } from "@/lib/sessions"

export default function Issues({ issuesData }) {
  console.log(issuesData)

  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [filteredIssues, setFilteredIssues] = useState(issuesData);

  const handleSearch = (searchTerm) => {
    const filtered = issuesData.filter((issue) =>
      issue.labels.some((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredIssues(filtered);
  };

  return (
    <>
      <Head>
      </Head>
      <main className={styles.mainContainer}>
        <Header />

        {/* TODO: Fix styling */}
        <h3><Link href={`/${namespaceName}`}>{namespaceName}(href)</Link></h3>
        <div className={styles.topContainer}>
        <IssueButtons onSearch={handleSearch} path={`/${namespaceName}/${projectName}`}/> 
        </div>
        <div className={styles.issueListContainer}>
          <IssueList issues={filteredIssues} routePath={`/${namespaceName}/${projectName}`} />
        </div>
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName } = context.query

  const session = await getServerSession(context.req, context.res)

  const project = await prisma.project.findFirst({
    where: {
      name: projectName,
      namespace: {
        name: namespaceName
      }
    },

    include: {
      namespace: true
    }
  })

  console.log("Project: ", project)

  if(project.private) {
    if(!session) {
      console.log("private - session is null")
      return {
        redirect: {
          destination: "/404",
          permanent: false
        }
      }
    }

    // Is the user apart of the project separately?
    if(project.namespace.projectId) {
      const isMember = await prisma.member.findFirst({
        where: {
          userId: session.user.id,
          projectId: project.id
        }
      })
  
      if(!isMember) {
        console.log("private - is not member")
        return {
          redirect: {
            destination: "/404",
            permanent: false
          }
        }
      }
    }

    // If the project belongs to an organization, then check if they are apart of that organization
    if(project.namespace.organizationId) {
      const isOrganizationMember = await prisma.member.findFirst({
        where: {
          userId: session.user.id,
          organizationId: project.namespace.organizationId
        }
      })
  
      if(!isOrganizationMember) {
        console.log("private - is not organization member")
        return {
          redirect: {
            destination: "/404",
            permanent: false
          }
        }
      }
    }
  }

  const issuesData = await prisma.issue.findMany({
    where: {
      projectId: project.id
    },
    include: {
      labels: true
    },
  });

  console.log(issuesData)

  return {
    props: {
      issuesData: issuesData.map((issue) => ({
        ...issue,
        createdAt: issue.createdAt.toISOString(),
        updatedAt: issue.updatedAt.toISOString(),
      })),
    },
  };
}
