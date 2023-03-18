import React from "react";
import styles from '../styles/Footer.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <FontAwesomeIcon icon={faBug} />
        <p>Bug-Zapper</p>
      </div>
    </footer>
  );
};
export default Footer;