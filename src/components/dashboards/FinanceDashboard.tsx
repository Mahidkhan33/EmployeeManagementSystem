'use client';

import { useState, useEffect } from 'react';
import { Wallet, DollarSign, Users, TrendingUp, PlayCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import styles from './Dashboard.module.css';

interface SalaryRecord {
  _id: string;
  name: string;
  amount: number;
  status: string;
  date: string;
  month: string;
  method: string;
}

export default function FinanceDashboard() {
  const { user, loading, getAuthHeader } = useAuth({ requiredDept: 'Finance' });
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [salaryStats, setSalaryStats] = useState({ totalPayout: 0, avgSalary: 0, pendingPayments: 0 });
  const [processing, setProcessing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  const fetchSalary = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/salary', { headers: getAuthHeader() });
      const data = await res.json();
      if (data.data) {
        setRecords(data.data.records || []);
        setSalaryStats(data.data.stats || {});
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchSalary();
  }, [user]);

  const runPayroll = async () => {
    setProcessing(true);
    setMessage('');
    try {
      const res = await fetch('/api/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Done');
      if (res.ok) await fetchSalary();
    } finally {
      setProcessing(false);
    }
  };

  if (loading || fetching) return <div className={styles.loading}>Loading Finance Dashboard...</div>;

  const cards = [
    { label: 'Total Payroll', value: `$${salaryStats.totalPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: '#10b981' },
    { label: 'Avg Salary', value: `$${Math.round(salaryStats.avgSalary).toLocaleString()}`, icon: Wallet, color: '#4f46e5' },
    { label: 'On Leave', value: salaryStats.pendingPayments, icon: Users, color: '#f59e0b' },
    { label: 'Trend', value: '+5%', icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            <Wallet size={14} /> Finance Department
          </div>
          <h1 className={styles.title}>Finance Dashboard</h1>
          <p className={styles.subtitle}>Payroll processing, salary records, and expenditure overview.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={runPayroll} disabled={processing}>
            <PlayCircle size={16} />
            {processing ? 'Processing...' : 'Run Payroll'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`${styles.alertBanner} ${message.includes('already') || message.includes('error') ? styles.alertError : styles.alertSuccess}`}>
          {message}
        </div>
      )}

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
          <h3 className={styles.cardTitle}>Payroll Records</h3>
          <span className={styles.badge}>{records.length} records</span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr><th>Employee</th><th>Month</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records yet. Run payroll to generate records.</td></tr>
              ) : records.map(rec => (
                <tr key={rec._id}>
                  <td><strong>{rec.name}</strong></td>
                  <td>{rec.month}</td>
                  <td><strong style={{ color: '#10b981' }}>${rec.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></td>
                  <td>{rec.method}</td>
                  <td>{rec.date}</td>
                  <td><span className={`${styles.status} ${styles[rec.status.toLowerCase()]}`}>{rec.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
