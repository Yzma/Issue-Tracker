import Head from "next/head";
import styles from "@/styles/IssueContainer.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IssueList from "@/components/IssueList";
import IssueButtons from "@/components/IssueButtons";
import SearchBar from "@/components/IssueSearchBar";
import { useState } from "react";
import prisma from "../../lib/prisma/prisma";

export async function getServerSideProps() {
  const issuesData = await prisma.issue.findMany({
    include: {
      labels: true,
    },
  });

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

export default function Issues({ issuesData }) {
  const [filteredIssues, setFilteredIssues] = useState(issuesData);

  const handleSearch = (searchTerm) => {
    const filtered = issuesData.filter((issue) =>
      issue.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIssues(filtered);
  };

  return (
    <>
      <Head>
      </Head>
      <main className={styles.mainContainer}>
        <Header />
        <div className={styles.topContainer}>
        <IssueButtons onSearch={handleSearch} /> 
        </div>
        <div className={styles.issueListContainer}>
          <IssueList issues={filteredIssues} />
        </div>
        <Footer />
      </main>
    </>
  );
}