import React from 'react';
import styles from '@/styles/LabelList.module.css';

const LabelList = ({ labels }) => {
  return (
    <div className={styles.labelListContainer}>
      <div className={styles.labelListWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.header}>
              <th className={styles.cell}>Name</th>
              <th className={styles.cell}>Description</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr key={index}>
                <td className={styles.cell}>{label.name}</td>
                <td className={styles.cell}>{label.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabelList;
