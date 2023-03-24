import React, { useState } from "react";
import layoutStyles from "@/styles/usersLayout.module.css";
import ProfileContainer from "../ProfileContainer";
import ProjectSection from "../OrgProjectSection";
import OrganizationSection from "../OrganizationSection";
import Head from "next/head";

const UserPage = ({ props }) => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <>
      <Head>
        <title>{props.data.username}'s Profile</title>
        <meta name="description" content="TODO: Description?" />
      </Head>

      <div className={layoutStyles.mainContainer}>
        <div className={layoutStyles.profileContainer}>
          <ProfileContainer username={props.data.username} bio={""} />
        </div>
        <div className={layoutStyles.rightSection}>
          <div className={layoutStyles.tabs}>
            <button
              className={`${layoutStyles.tabButton} ${activeTab === "projects" ? layoutStyles.activeTab : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`${layoutStyles.tabButton} ${activeTab === "organizations" ? layoutStyles.activeTab : ""}`}
              onClick={() => setActiveTab("organizations")}
            >
              Organizations
            </button>
          </div>
          <div className={layoutStyles.contentSection}>
            {activeTab === "projects" ? (
              <ProjectSection projects={props.namespace.projects} />
            ) : (
              <OrganizationSection organizations={props.data.organizations} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;

