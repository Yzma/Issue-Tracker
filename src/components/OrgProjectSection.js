import React from "react";
import styles from "../styles/OrgProjectSection.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const ProjectSection = ({ projects }) => {
  const router = useRouter()
  const { namespaceName } = router.query

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

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
              <td className={styles.cell}><Link href={`/${namespaceName}/${project.name}/issues`}>{project.name}</Link></td>
              <td className={styles.cell}>{project.description}</td>
              <td className={styles.cell}>{new Date(project.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.createProjectBtn} onClick={handleCreateProject}>
        Create Project
      </button>
    </section>
  );
};

export default ProjectSection;

// import React from "react";
// import styles from "../styles/OrgProjectSection.module.css";
// import Link from "next/link";
// import { useRouter } from "next/router";

// const ProjectSection = ({ projects }) => {
//   const router = useRouter()
//   const { namespaceName } = router.query
//   return (
//     <section className={styles.container}>
//       <h2>Projects</h2>
//       <table className={styles.table}>
//         <thead>
//           <tr className={styles.header}>
//             <th className={styles.cell}>Name</th>
//             <th className={styles.cell}>Description</th>
//             <th className={styles.cell}>Last Update</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map((project) => (
//             <tr key={project.id}>
//               <td className={styles.cell}><Link href={`/${namespaceName}/${project.name}/issues`}>{project.name}</Link></td>
//               <td className={styles.cell}>{project.description}</td>
//               <td className={styles.cell}>{new Date(project.updatedAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </section>
//   );
// };

// export default ProjectSection;

