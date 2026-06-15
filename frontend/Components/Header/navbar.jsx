'use client';
import React, { useState } from 'react'
import style from './header.module.css'
import Link from 'next/link'

export default function Navbar({ navbar }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={style.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        <span className={`${style.bar} ${isOpen ? style.barOpen1 : ''}`}></span>
        <span className={`${style.bar} ${isOpen ? style.barOpen2 : ''}`}></span>
        <span className={`${style.bar} ${isOpen ? style.barOpen3 : ''}`}></span>
      </button>
      <div className={`${style.navMenu} ${isOpen ? style.navMenuOpen : ''}`}>
          {navbar?.map((item) => (
              <div key={item.id} className={style.navItemContainer}>
                  {item.route ? (
                      <Link href={item.route} className={style.navItem} onClick={() => setIsOpen(false)}>
                          {item.label}
                      </Link>
                  ) : (
                      <div className={style.navItem}>
                          {item.label}
                      </div>
                  )}
                  {item.dropdown && item.dropdown.length > 0 && (
                      <div className={style.navDropdown}>
                          {item.dropdown.map(sub => (
                              <Link key={sub.id} href={sub.route} className={style.navDropdownItem} onClick={() => setIsOpen(false)}>
                                  {sub.label}
                              </Link>
                          ))}
                      </div>
                  )}
              </div>
          ))}
      </div>
    </>
  )
}
