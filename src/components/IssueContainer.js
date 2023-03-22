import React from "react";
import styles from "@/styles/IssueContainer.module.css";
import Link from "next/link";

// TODO: We're prop drilling here, figure out a way to make the routing nicer. Context API?
const Issue = ({ issue, routePath }) => {
  console.log("routePath", routePath)
  return (
    <tr>
      <td className={styles.cell}><Link href={`${routePath}/issues/${issue.id}`}>{issue.name}</Link></td>
      <td className={styles.cell}>
        {issue.labels.map((label) => label.name).join(", ")}
      </td>
      <td className={styles.cell}>{issue.open ? "Open" : "Closed"}</td>
      <td className={styles.cell}>{issue.createdAt}</td>
      <td className={styles.cell}>{issue.updatedAt}</td>
    </tr>
  );
};

export default Issue;