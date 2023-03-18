import React from 'react';
import styles from '@/styles/IssueContainer.module.css';

const Issue = ({ issue }) => {
  return (
    <div className={styles.issueContainer}>
      <h3>{issue.title}</h3>
      <p>
        <strong>Issue #{issue.issueNumber}:</strong> {issue.description}
      </p>
      <p>
        <strong>Status:</strong> {issue.status}
      </p>
      <p>
        <strong>Created at:</strong> {issue.createdAt}
      </p>
      <p>
        <strong>Updated:</strong> {issue.updatedAt}
      </p>
    </div>
  );
};

export default Issue;