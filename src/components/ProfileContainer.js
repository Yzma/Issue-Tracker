import React from 'react';
import styles from "../styles/ProfileContainer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ProfileContainer = ({ username, bio }) => {
  return (
    <section className={styles.container}>
      <div className={styles.profileImage}>
      <FontAwesomeIcon icon={faUser} />
      </div>
      <h2>{username}</h2>
      <p>{bio}</p>
    </section>
  );
};

export default ProfileContainer;