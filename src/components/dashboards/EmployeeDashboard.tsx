'use client';

import { useEffect, useState } from 'react';
import { UserCircle, Wallet, Building2, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Employee } from '@/types';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export default function EmployeeDashboard() {
  const { user, loading, getAuthHeader } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/employees', { headers: getAuthHeader() })
      .then(r => r.json())
      .then(data => {
        const emps: Employee[] = data.data || [];
        setProfile(emps.find(e => e.email === user.email) || null);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user]);

  if (loading || fetching) return <div className={styles.loading}>Loading your profile...</div>;

  const joined = profile?.joiningDate
    ? new Date(profile.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#64748b20', color: '#64748b' }}>
            <UserCircle size={14} /> Employee
          </div>
          <h1 className={styles.title}>Welcome back, {user?.name}!</h1>
          <p className={styles.subtitle}>Here is a summary of your profile and activity.</p>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>My Profile</h3>
            <button className={styles.viewAll} onClick={() => router.push('/profile')}>Edit Profile</button>
          </div>
          <div className={styles.profileSummary}>
            {[
              { label: 'Full Name', value: `${profile?.firstName} ${profile?.lastName}`, icon: UserCircle },
              { label: 'Department', value: profile?.department, icon: Building2 },
              { label: 'Position', value: profile?.position, icon: UserCircle },
              { label: 'Joined', value: joined, icon: Calendar },
            ].map((item, i) => (
              <div key={i} className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{item.label}</span>
                <span className={styles.summaryValue}>{item.value || '—'}</span>
              </div>
            ))}
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Status</span>
              <span className={`${styles.status} ${styles[(profile?.status || 'active').toLowerCase().replace(' ', '')]}`}>
                {profile?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sideCard}>
          <h3 className={styles.cardTitle}>Quick Links</h3>
          <div className={styles.quickLinks}>
            <button className={styles.linkBtn} onClick={() => router.push('/salary')}>
              <Wallet size={14} /> My Salary
            </button>
            <button className={styles.linkBtn} onClick={() => router.push('/profile')}>
              <UserCircle size={14} /> Edit Profile
            </button>
            <button className={styles.linkBtn} onClick={() => router.push('/settings')}>
              Account Settings
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.cardTitle}>Salary Preview</h3>
            <div className={styles.salaryPreview}>
              <div className={styles.salaryAmount}>
                ${profile ? Math.round(profile.salary / 12).toLocaleString() : '—'}
                <span>/month</span>
              </div>
              <p className={styles.salaryNote}>Annual: ${profile?.salary?.toLocaleString() || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
