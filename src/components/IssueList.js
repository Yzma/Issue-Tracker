import React from 'react';
import styles from '@/styles/IssueContainer.module.css';
import Issue from './IssueContainer';

const IssueList = ({ issues, routePath }) => {
  return (
    <div className={styles.issueListWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.header}>
            <th className={styles.cell}>Title</th>
            <th className={styles.cell}>Label</th>
            <th className={styles.cell}>Status</th>
            <th className={styles.cell}>Created At</th>
            <th className={styles.cell}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <Issue key={index} issue={issue} routePath={routePath} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueList;