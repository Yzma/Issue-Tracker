import React from 'react';
import styles from '@/styles/IssueButtons.module.css';
import SearchBar from './IssueSearchBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const IssueButtons = ({onSearch}) => {
  return (
    <div className={styles.buttonsContainer}>
      <SearchBar onSearch={onSearch} />
      <button className={styles.button} onClick={() => {}}>
      <FontAwesomeIcon icon={faTag} />  Label
      </button>
      <button className={styles.button} onClick={() => {}}>
      <FontAwesomeIcon icon={faPlus} />  Create Issue
      </button>
    </div>
  );
};

export default IssueButtons;

