'use client';

import { useState, useEffect } from 'react';
import { Monitor, Code, Server, GitBranch } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Employee } from '@/types';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export default function ITDashboard() {
  const { user, loading, getAuthHeader } = useAuth({ requiredDept: 'IT' });
  const router = useRouter();
  const [team, setTeam] = useState<Employee[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/employees?department=IT', { headers: getAuthHeader() })
      .then(r => r.json())
      .then(data => { setTeam(data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [user]);

  if (loading || fetching) return <div className={styles.loading}>Loading IT Dashboard...</div>;

  const active = team.filter(e => e.status === 'Active').length;
  const cards = [
    { label: 'IT Team', value: team.length, icon: Monitor, color: '#4f46e5' },
    { label: 'Active Engineers', value: active, icon: Code, color: '#10b981' },
    { label: 'Open Tickets', value: 12, icon: Server, color: '#f59e0b' },
    { label: 'Sprints', value: 3, icon: GitBranch, color: '#8b5cf6' },
  ];

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#4f46e520', color: '#4f46e5' }}>
            <Monitor size={14} /> IT Department
          </div>
          <h1 className={styles.title}>IT Dashboard</h1>
          <p className={styles.subtitle}>Engineering team, infrastructure, and project overview.</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {cards.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{card.label}</span>
              <h2 className={styles.statValue}>{card.value}</h2>
            </div>
            <div className={styles.statIcon} style={{ backgroundColor: `${card.color}18`, color: card.color }}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Engineering Team</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Position</th><th>Status</th></tr></thead>
            <tbody>
              {team.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>No IT staff found.</td></tr>
              ) : team.map(m => (
                <tr key={m._id} className={styles.clickableRow} onClick={() => router.push(`/employees/${m._id}`)}>
                  <td>
                    <div className={styles.userName}>
                      <div className={styles.userAvatar}>{m.firstName[0]}{m.lastName[0]}</div>
                      <span>{m.firstName} {m.lastName}</span>
                    </div>
                  </td>
                  <td>{m.position}</td>
                  <td><span className={`${styles.status} ${styles[m.status.toLowerCase().replace(' ', '')]}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
