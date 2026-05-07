import { 
  Plus, 
  Search, 
  Download, 
  Wallet,
  TrendingUp,
  CreditCard,
  History
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Salary.module.css';

const salaryRecords = [
  { id: 1, name: 'John Doe', amount: '$5,000', status: 'Paid', date: '2026-04-28', method: 'Bank Transfer' },
  { id: 2, name: 'Jane Smith', amount: '$4,200', status: 'Paid', date: '2026-04-28', method: 'PayPal' },
  { id: 3, name: 'Robert Fox', amount: '$6,500', status: 'Pending', date: '2026-05-01', method: 'Bank Transfer' },
];

export default function SalaryPage() {
  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Salary Records</h1>
            <p className={styles.subtitle}>Track and manage employee payments and history</p>
          </div>
          <button className={styles.addBtn}>
            <Plus size={20} />
            <span>Process Payroll</span>
          </button>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Wallet size={24} /></div>
            <div>
              <span className={styles.statLabel}>Total Payout (Monthly)</span>
              <h2 className={styles.statValue}>$185,420</h2>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><TrendingUp size={24} /></div>
            <div>
              <span className={styles.statLabel}>Avg Increase</span>
              <h2 className={styles.statValue}>+4.5%</h2>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><CreditCard size={24} /></div>
            <div>
              <span className={styles.statLabel}>Pending Payments</span>
              <h2 className={styles.statValue}>12</h2>
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
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((record) => (
                  <tr key={record.id}>
                    <td className={styles.empName}>{record.name}</td>
                    <td className={styles.amount}>{record.amount}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
