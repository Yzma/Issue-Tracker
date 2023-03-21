import React from "react";
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <FontAwesomeIcon icon={faBug} size="2x" />
        <p>Bug-Zapper</p>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="/issues">Issues</a>
          </li>
          <li>
            <a href="/orgs">Organizations</a>
          </li>
          <li>
            <a href="/login">Login/Logout</a>
          </li>
          <li>
          <FontAwesomeIcon icon={faPlus}/>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;