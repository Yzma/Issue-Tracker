import React from 'react';
import styles from "../styles/OrgUserSection.module.css";
import { useRouter } from 'next/router';
import Link from 'next/link';

const UserSection = ({ users }) => {
  const router = useRouter()
  const { namespaceName } = router.query
  return (
    <section className={styles.container}>
      <h2>Users</h2>
      <ul className={styles.projectList}>
        {users.map((user, index) => (
          <li key={index} className={styles.projectItem}>
            <div className={styles.projectItemHeader}>
              <h3><Link href={`/${user}`}>{user}</Link></h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UserSection;