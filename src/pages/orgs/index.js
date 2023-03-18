import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import layoutStyles from "@/styles/OrgLayout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import OrganizationContainer from "@/components/OrganizationContainer";
import OrgProjectSection from "@/components/OrgProjectSection";
import Tabs from "@/components/OrgPageTabs";
import UserSection from "@/components/OrgUserSection"
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Org() {
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const orgName = "Bug Zapper";
  const bio = "Z";
  const projects = [
    {
      id: 1,
      name: "Tweeter App",
      description: "Twitter clone app",
      updated_at: "March 17 2023",
    },
    {
      id: 2,
      name: "Scheduler App",
      description: "Scheduler Appointment App",
      updated_at: "March 17 2023",
    },
  ];
  const users = ["Julian Paredes", "Andrew Caruso"];
  return (
    <>
      <Head>
        {/* ... */}
      </Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        <div className={layoutStyles.profileContainer}>
          <OrganizationContainer orgName={orgName} bio={bio} />
        </div>
        <div className={layoutStyles.projectSection}>
          <Tabs activeTab={activeTab} onTabClick={handleTabClick} />
          {activeTab === "projects" && (
            <OrgProjectSection projects={projects} />
          )}
          {activeTab === "users" && (
            <UserSection users={users} />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
