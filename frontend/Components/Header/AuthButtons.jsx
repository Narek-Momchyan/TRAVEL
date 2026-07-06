"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import style from './header.module.css';

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = require('next/navigation').usePathname();
  const prevToken = React.useRef(undefined);

  const checkLogin = () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();
    
    window.addEventListener('authChange', checkLogin);
    return () => window.removeEventListener('authChange', checkLogin);
  }, []);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_wishlist');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChange'));
    window.location.replace('/');
  };

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href="/profile" className={style.registerBtn} style={{ padding: '8px 16px', background: '#1a859c', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
          <FaUser />
        </Link>
        <button onClick={handleLogout} className={style.registerBtn} style={{ padding: '8px 16px', background: '#1a859c', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          <FaSignOutAlt />
        </button>
      </div>
    );
  }

  return (
    <Link href="/register" className={style.registerBtn} style={{ marginLeft: '15px', padding: '8px 16px', background: '#1a859c', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
      <FaUser />
    </Link>
  );
}
