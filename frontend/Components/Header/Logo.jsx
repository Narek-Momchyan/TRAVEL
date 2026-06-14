import React from 'react'
import style from './header.module.css'
  
export default function Logo({logo}) {
  return (
    <div className={style.logoWrapper}>
      <img src={logo?.img_route} alt={logo?.logo_route} />
    </div>
  )
}
