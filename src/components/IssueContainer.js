import React from "react";
import styles from "@/styles/IssueContainer.module.css";

const Issue = ({ issue }) => {
  return (
    <tr>
      <td className={styles.cell}>{issue.name}</td>
      <td className={styles.cell}>
        {issue.labels.map((label) => label.name).join(", ")}
      </td>
      <td className={styles.cell}>{issue.open ? "Open" : "Closed"}</td> {/* Add this table cell */}
      <td className={styles.cell}>{issue.createdAt}</td>
      <td className={styles.cell}>{issue.updatedAt}</td>
    </tr>
  );
};

export default Issue;