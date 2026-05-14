'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Clock, User, Activity, Search, Filter } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './AuditLogs.module.css';

interface AuditLog {
  _id: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export default function AuditLogsPage() {
  const { user, loading, getAuthHeader } = useAuth({ requiredRole: 'admin' });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/audit-logs', { headers: getAuthHeader() })
      .then(r => r.json())
      .then(data => { setLogs(data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [user]);

  if (loading) return <div className={styles.loading}>Verifying access...</div>;

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <div>
            <div className={styles.roleBadge} style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
              <ShieldAlert size={14} /> Security
            </div>
            <h1 className={styles.title}>System Audit Logs</h1>
            <p className={styles.subtitle}>Track sensitive actions, logins, and system changes across the platform.</p>
          </div>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Search by email or action..." />
          </div>
          <div className={styles.actions}>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filter Logs</span>
            </button>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>Loading security logs...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>No audit logs found.</td></tr>
                ) : logs.map(log => (
                  <tr key={log._id}>
                    <td className={styles.timestamp}>
                      <div className={styles.timeRow}>
                        <Clock size={14} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className={styles.userInfo}>
                        <User size={14} />
                        <span>{log.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.actionBadge} ${styles[log.action.toLowerCase()] || styles.default}`}>
                        <Activity size={12} />
                        {log.action}
                      </span>
                    </td>
                    <td className={styles.details}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
