import React, { useState } from 'react';
import styles from '@/styles/IssueSearchBar.module.css';

const IssueSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      className={styles.searchInput}
      type="text"
      placeholder="Search Title"
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

export default IssueSearchBar;