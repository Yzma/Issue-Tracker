import React from "react";
import styles from "../styles/OrgProjectSection.module.css";

const ProjectSection = ({ projects }) => {
  return (
    <section className={styles.container}>
      <h2>Projects</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.header}>
            <th className={styles.cell}>Name</th>
            <th className={styles.cell}>Description</th>
            <th className={styles.cell}>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className={styles.cell}>{project.name}</td>
              <td className={styles.cell}>{project.description}</td>
              <td className={styles.cell}>{new Date(project.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProjectSection;

