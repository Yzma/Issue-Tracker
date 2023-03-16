import React from 'react';
import styles from "../styles/ProjectSection.module.css";

const ProjectSection = ({ projects }) => {
  return (
    <section className={styles.container}>
      <h2>Projects</h2>
      <ul className={styles.projectList}>
        {projects.map((project) => (
          <li key={project.id} className={styles.projectItem}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectSection;