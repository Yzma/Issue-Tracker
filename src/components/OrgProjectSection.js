import React from 'react';
import styles from "../styles/OrgProjectSection.module.css";

const ProjectSection = ({ projects }) => {
  return (
    <section className={styles.container}>
      <h2>Projects</h2>
      <ul className={styles.projectList}>
        {projects.map((project) => (
          <li key={project.id} className={styles.projectItem}>
            <div className={styles.projectItemHeader}>
              <h3>{project.name}</h3>
              <p className={styles.updateDate}>Last updated: {project.updated_at}</p>
            </div>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectSection;