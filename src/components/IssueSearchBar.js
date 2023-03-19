import { useState } from 'react';
import styles from '@/styles/IssueSearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon (fa-magnifying-glass)


const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search Label"
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchBar}
      />
    <button onClick={handleSearchClick} className={styles.searchButton}>
      <FontAwesomeIcon icon={faSearch} />
      <span> Search</span>
    </button>
    </div>
  );
};

export default SearchBar;