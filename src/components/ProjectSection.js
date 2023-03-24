import React from 'react';
import styles from "../styles/ProjectSection.module.css";
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProjectSection = ({ projects }) => {
  const router = useRouter()
  const { namespaceName } = router.query
  console.log("test: ", namespaceName)

  const handleCreateProject = () => {
    // Handle create project logic here
  };

  return (
    <section className={styles.container}>
      <h2>Projects</h2>
      <ul className={styles.projectList}>
        {projects.map((project) => (
          <li key={project.id} className={styles.projectItem}>
            <div className={styles.projectItemHeader}>
              <h3><Link href={`${namespaceName}/${project.name}`}>{project.name}</Link></h3>
              <p className={styles.updateDate}>Last updated: {project.updated_at}</p>
            </div>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
      <button className={styles.createProjectBtn} onClick={handleCreateProject}>
        Create Project
      </button>
    </section>
  );
};

export default ProjectSection;

