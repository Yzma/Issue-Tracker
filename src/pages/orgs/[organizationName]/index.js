import Head from "next/head";
import layoutStyles from "@/styles/OrgLayout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrganizationContainer from "@/components/OrganizationContainer";
import OrgProjectSection from "@/components/OrgProjectSection";
import Tabs from "@/components/OrgPageTabs";
import UserSection from "@/components/OrgUserSection";
import { useState } from "react";
import prisma from "@/lib/prisma/prisma";
import { getServerSession } from "@/lib/sessions"

export default function Org({ organization }) {
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const projects = organization.namespace?.projects || [];

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <>
      <Head></Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        {/* <div className={layoutStyles.profileContainer}>
          <OrganizationContainer
            orgName={organization.name}
            organizationMembers={organization.organizationMembers}
          />
        </div> */}
        <div className={layoutStyles.projectSection}>
          <Tabs activeTab={activeTab} onTabClick={handleTabClick} />
          {activeTab === "projects" && (
            <OrgProjectSection projects={projects} />
          )}
          {activeTab === "users" && (
            <UserSection
              users={organization.organizationMembers.map(
                (member) => member.user.name
              )}
            />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res)

  console.log(session)

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/api/auth/signin", // goes to sign in page if no one logged in 
  //       permanent: false,
  //     },
  //   };
  // }

  const organization = await prisma.organization.findFirst({
    where: {
      id: "clfha6acb000vs3p26hlr90cl", //org id from db 
      // id: session.organization.id,
    },
    include: {
      organizationMembers: {
        include: {
          user: true,
        },
      },
      namespace: {
        include: {
          projects: true,
        },
      },
    },
  });

  console.log("Organization:", organization);

  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
    },
  };
}
