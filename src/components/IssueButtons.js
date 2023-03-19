import React from 'react';
import styles from '@/styles/IssueButtons.module.css';

const IssueButtons = () => {
  return (
    <div className={styles.buttonsContainer}>
      <button className={styles.button} onClick={() => {}}>
        Label
      </button>
      <button className={styles.button} onClick={() => {}}>
        Create Issue
      </button>
    </div>
  );
};

export default IssueButtons;