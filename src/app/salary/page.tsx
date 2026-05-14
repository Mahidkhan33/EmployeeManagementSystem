"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Wallet,
  TrendingUp,
  CreditCard,
  History
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Salary.module.css';

export default function SalaryPage() {
  const [data, setData] = useState<{
    records: { _id: string; name: string; amount: number; date: string; method: string; status: string }[];
    stats: { totalPayout: number; avgSalary: number; pendingPayments: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<{ role: string; email: string } | null>(null);

  const fetchSalaryData = useCallback(async (email?: string) => {
    try {
      const url = email ? `/api/salary?email=${email}` : '/api/salary';
      const res = await fetch(url);
      const json = await res.json();
      if (json.data) {
        setData(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch salary data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProcessPayroll = async () => {
    if (!confirm('Are you sure you want to process payroll for the current month?')) return;
    
    setProcessing(true);
    try {
      const res = await fetch('/api/salary', { method: 'POST' });
      const json = await res.json();
      
      if (res.ok) {
        alert(json.message);
        fetchSalaryData(user?.role === 'employee' ? user.email : undefined);
      } else {
        alert(json.error || 'Failed to process payroll');
      }
    } catch (error) {
      alert('An error occurred during payroll processing');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchSalaryData(parsedUser.role === 'employee' ? parsedUser.email : undefined);
    } else {
      fetchSalaryData();
    }
  }, [fetchSalaryData]);

  const stats = data?.stats || { totalPayout: 0, avgSalary: 0, pendingPayments: 0 };
  const records = data?.records || [];

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Salary Records</h1>
            <p className={styles.subtitle}>Track and manage employee payments and history</p>
          </div>
          {user?.role === 'admin' && (
            <button 
              className={styles.addBtn} 
              onClick={handleProcessPayroll}
              disabled={processing}
            >
              <Plus size={20} />
              <span>{processing ? 'Processing...' : 'Process Payroll'}</span>
            </button>
          )}
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Wallet size={24} /></div>
            <div>
              <span className={styles.statLabel}>Total Payout (Annual)</span>
              <h2 className={styles.statValue}>${stats.totalPayout.toLocaleString()}</h2>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><TrendingUp size={24} /></div>
            <div>
              <span className={styles.statLabel}>Avg Salary</span>
              <h2 className={styles.statValue}>${Math.round(stats.avgSalary).toLocaleString()}</h2>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><CreditCard size={24} /></div>
            <div>
              <span className={styles.statLabel}>Pending Payments</span>
              <h2 className={styles.statValue}>{stats.pendingPayments}</h2>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Payment History</h3>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Search history..." />
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Monthly Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No records found.</td></tr>
                ) : (
                  records.map((record: { _id: string; name: string; amount: number; date: string; method: string; status: string }) => (
                    <tr key={record._id}>
                      <td className={styles.empName}>{record.name}</td>
                      <td className={styles.amount}>${Math.round(record.amount).toLocaleString()}</td>
                      <td>{record.date}</td>
                      <td>{record.method}</td>
                      <td>
                        <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.historyBtn}>
                          <History size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
