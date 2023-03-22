
import React from 'react';
import styles from "../styles/OrganizationContainer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const OrganizationContainer = ({ orgName, bio }) => {
  return (
    <section className={styles.container}>
      <div className={styles.profileImage}>
      <FontAwesomeIcon icon={faUser} />
      </div>
      <h2>{orgName}</h2>
      <p>{bio}</p>
    </section>
  );
};

export default OrganizationContainer;