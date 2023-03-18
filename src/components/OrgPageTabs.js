import React from 'react';
import styles from '../styles/OrgPageTabs.module.css';

const Tabs = ({ activeTab, onTabClick }) => {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
        onClick={() => onTabClick('projects')}
      >
        Projects
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
        onClick={() => onTabClick('users')}
      >
        Users
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
        onClick={() => onTabClick('settings')}
      >
        Settings
      </button>
    </div>
  );
};

export default Tabs;