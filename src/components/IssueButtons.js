import React from 'react';
import styles from '@/styles/IssueButtons.module.css';
import SearchBar from './IssueSearchBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router"

const IssueButtons = ({onSearch, path}) => {
  const router = useRouter()
  return (
    <div className={styles.buttonsContainer}>
      <SearchBar onSearch={onSearch} />
      <button className={styles.button} onClick={() => router.push(`${path}/labels`)}>
      <FontAwesomeIcon icon={faTag} />  Label
      </button>
      <button className={styles.button} onClick={() => router.push(`${path}/issues/new`)}>
      <FontAwesomeIcon icon={faPlus} />  Create Issue
      </button>
    </div>
  );
};

export default IssueButtons;

