import React, { useState } from "react";
import ProfileContainer from "../ProfileContainer";
import ProjectSection from "../OrgProjectSection";
import OrganizationSection from "../OrganizationSection";
import Head from "next/head";
import BelowNavbar from "../other/BelowNavbar";

const UserPage = ({ props }) => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <>
      <Head>
        <title>{props.data.username}'s Profile</title>
        <meta name="description" content="TODO: Description?" />
      </Head>
      <BelowNavbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-start">
          <div className="w-1/4 mt-6">
            <ProfileContainer username={props.data.username} bio={""} />
          </div>
          <div className="w-3/4 pl-8">
            <div className="flex flex-col items-start">
              <div className="flex justify-center w-full mt-4">
                <button
                  className={`px-4 py-2 font-semibold rounded ${
                    activeTab === "projects"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setActiveTab("projects")}
                >
                  Projects
                </button>
                <button
                  className={`px-4 py-2 font-semibold rounded ${
                    activeTab === "organizations"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setActiveTab("organizations")}
                >
                  Organizations
                </button>
              </div>
              <div className="w-full max-w-5xl mt-4">
                {activeTab === "projects" ? (
                  <ProjectSection projects={props.namespace.projects} />
                ) : (
                  <OrganizationSection
                    organizations={props.data.members.map(
                      (member) => member.organization
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
