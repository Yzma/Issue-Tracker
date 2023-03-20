import React from 'react';
import styles from '../styles/OrgPageTabs.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Tabs = ({ activeTab, onTabClick }) => {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
        onClick={() => onTabClick('projects')}
      >
       <FontAwesomeIcon icon={faFolder} />  Projects
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
        onClick={() => onTabClick('users')}
      >
      <FontAwesomeIcon icon={faUsers} />  Users
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
        onClick={() => onTabClick('settings')}
      >
      <FontAwesomeIcon icon={faGear} />  Settings
      </button>
    </div>
  );
};

export default Tabs;