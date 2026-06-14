import React from 'react'
import style from './header.module.css'
import Link from 'next/link'
export default function Navbar({ navbar }) {
  return (
    <div className={style.navMenu}>
        {navbar?.map((item) => (
            <div key={item.id} className={style.navItemContainer}>
                {item.route ? (
                    <Link href={item.route} className={style.navItem}>
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
                            <Link key={sub.id} href={sub.route} className={style.navDropdownItem}>
                                {sub.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        ))}
    </div>
  )
}
