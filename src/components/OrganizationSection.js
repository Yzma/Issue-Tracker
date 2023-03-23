import React from "react";
import styles from "../styles/OrganizationSection.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const OrganizationSection = ({ organizations }) => {
  console.log("OrganizationSection organizations", organizations);

  const router = useRouter();

  const handleCreateOrganization = () => {
    router.push("/orgs/create");
  };

  return (
    <section className={styles.container}>
      {typeof organizations === 'undefined' ? (
        <p>No Organization Found</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr className={styles.header}>
                <th className={styles.cell}>Name</th>
                <th className={styles.cell}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.id}>
                  <td className={styles.cell}>
                    <Link href={`/orgs/${organization.name}`}>{organization.name}</Link>
                  </td>
                  <td className={styles.cell}>
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <button
        onClick={handleCreateOrganization}
      >
        Create Organization
      </button>
    </section>
  );
};

export default OrganizationSection;