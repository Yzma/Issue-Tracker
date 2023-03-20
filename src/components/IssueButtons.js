import React from 'react';
import styles from '@/styles/IssueButtons.module.css';
import SearchBar from './IssueSearchBar';

const IssueButtons = ({onSearch}) => {
  return (
    <div className={styles.buttonsContainer}>
      <SearchBar onSearch={onSearch} />
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

