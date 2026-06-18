import React from 'react'
import style from './header.module.css'
import Link from 'next/link'
  
export default function Logo({logo}) {
  return (
    <div className={style.logoWrapper}>
      <Link href="/" className='cursor-pointer'><img src={logo?.img_route} alt={logo?.logo_route} /></Link>
      
    </div>
  )
}
