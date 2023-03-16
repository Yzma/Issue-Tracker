import React from "react";
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Header = () => {
  return (
    <header className={styles.header}>
      <FontAwesomeIcon icon={faGithub} size="2x" />
      <nav className={styles.nav}>

        <ul>
          <li>
            <a href="/issues">Issues</a>
          </li>
          <li>
            <a href="/organizations">Organizations</a>
          </li>
          {/* Add login/logout logic or links here */}
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;