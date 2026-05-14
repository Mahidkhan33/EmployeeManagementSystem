'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Settings.module.css';
import { Bell, Shield, User, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile and application preferences</p>
        </header>

        <div className={styles.container}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.active}`}>
              <User size={18} />
              <span>Profile</span>
            </button>
            <button className={styles.tab}>
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button className={styles.tab}>
              <Shield size={18} />
              <span>Security</span>
            </button>
            <button className={styles.tab}>
              <Globe size={18} />
              <span>Language</span>
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Personal Information</h3>
              <div className={styles.form}>
                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 000-0000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Role</label>
                    <input type="text" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} disabled />
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveBtn}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
