import React, { useState } from "react";
import { useRouter } from "next/router";
import layoutStyles from "@/styles/usersLayout.module.css";
import Head from "next/head";

import OrgProjectSection from "@/components/OrgProjectSection";
import Tabs from "@/components/OrgPageTabs";
import UserSection from "@/components/OrgUserSection";
import OrganizationBelowNavbar from "../navbar/OrganizationBelowNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

const OrganizationPage = ({ props }) => {
  const router = useRouter();
  const { namespaceName } = router.query;
  console.log("Org props ", props);

  const [activeTab, setActiveTab] = useState("projects");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Head>
        <title>{props.data.name}</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <OrganizationBelowNavbar
        namespaceName={namespaceName}
        selected={"projects"}
      />

      <div className={`${layoutStyles.projectSection} mt-9`}>
        {" "}
        {/* Add the mt-4 class here */}
        {/* <Tabs activeTab={activeTab} onTabClick={handleTabClick} /> */}
        {activeTab === "projects" && (
          <OrgProjectSection projects={props.namespace.projects} />
        )}
        {activeTab === "users" && (
          <UserSection
            users={props.data.members.map((member) => member.user.username)}
          />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center pb-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faBug} />
          <p className="mt-2">Bug-Zapper</p>
        </div>
      </div>
    </>
  );
};

export default OrganizationPage;
