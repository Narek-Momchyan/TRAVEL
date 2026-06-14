import React from 'react';
import styles from './homepage.module.css';

export default function Companies({ compani }) {
  if (!compani) return null;

  return (
    <section className={styles.companiesSection}>
      <div className={styles.companiesContainer}>
        {compani.map((item) => (
          <div key={item.id} className={styles.companyLogo}>
            <img src={item.images || item.image} alt='company'/>
          </div>
        ))}
      </div>
    </section>
  );
}
