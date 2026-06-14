import React from 'react'
import Link from 'next/link'
import styles from "./homepage.module.css"

export default function HeroInfo({heroinfo}) {
  return (
    <div className={styles.heroInfoContainer}>
        <h1 className={styles.title}><img src={heroinfo.icon_route} alt={heroinfo.title} />{heroinfo.title} </h1>
        <p className={styles.subtitle}>{heroinfo.subtitle}</p>
        <Link className={styles.button} href={heroinfo.button_route || '#'}>{heroinfo.button_text}</Link>
    </div>
  )
}
