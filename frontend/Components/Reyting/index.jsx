import React from 'react'
import api from '@/lib/api'
import styles from "./reyting.module.css"
import {getLanguage} from '@/lib/lang'

export default async function Reyting() {
  const lang = await getLanguage();
  const resdata = await api.get(`ratings/?lang=${lang}`)
  const dataArr = await resdata.data
  const data = Array.isArray(dataArr) ? dataArr[0] : dataArr

  return (
    <div className={styles.reytingContainer}>
      <div className={styles.divider}></div>
      <p className={styles.reytingText}>{data?.text}</p>
      <div className={styles.starsRow}>
        {Array.from({ length: data?.rating ?? 5 }).map((_, i) => (
          <span key={i} className={styles.star}>★</span>
        ))}
      </div>
    </div>
  )
}
