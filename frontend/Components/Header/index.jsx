import React from 'react'
import { getLanguage } from '@/lib/lang'
import api from '@/lib/api'
import Logo from './Logo'
import Navbar from './navbar'
import Languages from './Languages'
import WishlistMenu from '@/app/WishlistMenu/page'
import style from './header.module.css'
import AuthButtons from './AuthButtons'

export default async function Header() {

  let reslogo = [];
  let resnavbar = [];
  let reslanguages = [];

  try {
    const lang = await getLanguage();
    const [logo, navbar, languages] = await Promise.all([
      api.get('logos/'),
      api.get(`navbars/?lang=${lang}`),
      api.get(`languages/`),

    ])
    reslogo = { img_route: logo.data?.image, logo_route: '/' };
    resnavbar = navbar.data || [];
    reslanguages = languages.data || [];

  } catch (err) {
    console.error(err.name, err.message, "tvyalneri berman het xntir ka");
  }

  return (
    <div className={style.headerContainer}>
      <div className={style.logoWrapper}>
        <Logo logo={reslogo} />
      </div>
      <Navbar navbar={resnavbar} />
      <div className={style.actionsContainer}>
        <Languages languages={reslanguages} />
        <WishlistMenu/>
        <AuthButtons />
      </div>
    </div>
  )
}
