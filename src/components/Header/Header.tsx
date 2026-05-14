'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder="Search anything..." className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user?.name || 'Guest'}</span>
            <span className={styles.profileRole}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Guest'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
