import React from 'react';
import styles from "../styles/OrgUserSection.module.css";


const UserSection = ({ users }) => {
  return (
    <section className={styles.container}>
      <h2>Users</h2>
      <ul className={styles.projectList}>
        {users.map((user, index) => (
          <li key={index} className={styles.projectItem}>
            <div className={styles.projectItemHeader}>
              <h3>{user}</h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UserSection;