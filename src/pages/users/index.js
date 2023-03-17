import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
// import styles from "@/styles/Home.module.css";
import layoutStyles from "@/styles/usersLayout.module.css";
import Header from "@/components/Header";
import ProfileContainer from '@/components/ProfileContainer';
import ProjectSection from '@/components/ProjectSection';
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function UserProfile() {
  //fake data for now
  const username = "Julian Paredes";
  const bio = "Full stack developer student at Lighthouse Labs";
  const projects = [
    { id: 1, name: "Tweeter App", description: "Twitter clone app", updated_at: "March 17 2023" },
    { id: 2, name: "Scheduler App", description: "Scheduler Appointment App", updated_at: "March 17 2023" },
  ];

  return (
    <>
      <Head>
        <title>User profile</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        <div className={layoutStyles.profileContainer}>
          <ProfileContainer username={username} bio={bio} />
        </div>
        <div className={layoutStyles.projectSection}>
        <ProjectSection projects={projects} />
        </div>
      </main>
    </>
  );
}
