'use client'
import React, { useState } from 'react'
import styles from "./homepage.module.css"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"

export default function WhyChoose({ whychoose }) {
  const [openId, setOpenId] = useState(3); 
  if (!whychoose) return null;

  return (
    <section className={styles.whySection}>
      <div className={styles.whyContainer}>
        <h2 className={styles.whyTitle}>{whychoose.mainTitle}</h2>
        <div className={styles.whyContent}>
          <div className={styles.whyLeft}>
            <img src={whychoose.image} alt="Why Choose Us" className={styles.whyImage} />
          </div>
          <div className={styles.whyRight}>
            <div className={styles.accordion}>
              {whychoose.items && whychoose.items.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className={styles.accordionItem}>
                    <div className={styles.accordionHeader} onClick={() => setOpenId(isOpen ? null : item.id)}>
                      <span className={styles.accordionLabel}>{index + 1}. {item.title}</span>
                      <span className={styles.accordionIcon}>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
                    </div>
                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <p className={styles.accordionText}>{item.content}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
