import { useState } from 'react';
import styles from '@/styles/IssueSearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search Label"
      value={searchTerm}
      onChange={handleChange}
      className={styles.searchBar}
    />
  );
};

export default SearchBar;