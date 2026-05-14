'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingUp, Building2, Wallet, BarChart2, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Employee } from '@/types';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const { user, loading, getAuthHeader } = useAuth({ requiredRole: 'admin' });
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, departments: 0, avgSalary: 0 });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          fetch('/api/employees', { headers: getAuthHeader() }),
          fetch('/api/departments', { headers: getAuthHeader() })
        ]);
        const empData = await empRes.json();
        const deptData = await deptRes.json();
        const emps: Employee[] = empData.data || [];
        setEmployees(emps);
        setStats({
          total: emps.length,
          active: emps.filter(e => e.status === 'Active').length,
          departments: (deptData.data || []).length,
          avgSalary: emps.length > 0 ? emps.reduce((a, e) => a + e.salary, 0) / emps.length : 0
        });
      } finally {
        setFetching(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading || fetching) return <div className={styles.loading}>Loading Admin Panel...</div>;

  const cards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: '#4f46e5', sub: `${stats.active} active` },
    { label: 'Departments', value: stats.departments, icon: Building2, color: '#10b981', sub: 'All modules' },
    { label: 'Avg Salary', value: `$${Math.round(stats.avgSalary).toLocaleString()}`, icon: Wallet, color: '#f59e0b', sub: 'Org-wide' },
    { label: 'Access Level', value: 'Full', icon: ShieldCheck, color: '#ef4444', sub: 'All depts' },
  ];

  const modules = [
    { label: 'HR Module', icon: Users, color: '#4f46e5', items: ['Employees', 'Attendance', 'Leaves'], path: '/employees' },
    { label: 'Finance Module', icon: Wallet, color: '#10b981', items: ['Payroll', 'Salary Slips'], path: '/salary' },
    { label: 'Departments', icon: Building2, color: '#f59e0b', items: ['Manage Depts', 'Assign Heads'], path: '/departments' },
    { label: 'Analytics', icon: BarChart2, color: '#8b5cf6', items: ['Reports', 'Trends'], path: '/dashboard' },
    { label: 'Settings', icon: Settings, color: '#64748b', items: ['System Config', 'Roles'], path: '/settings' },
  ];

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#4f46e520', color: '#4f46e5' }}>
            <ShieldCheck size={14} /> Admin
          </div>
          <h1 className={styles.title}>Admin Command Center</h1>
          <p className={styles.subtitle}>Full system access — manage all departments, users, and settings.</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {cards.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{card.label}</span>
              <h2 className={styles.statValue}>{card.value}</h2>
              <div className={styles.statTrend}>
                <span className={styles.trendLabel}>{card.sub}</span>
              </div>
            </div>
            <div className={styles.statIcon} style={{ backgroundColor: `${card.color}18`, color: card.color }}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.moduleGrid}>
        {modules.map((mod, i) => (
          <button key={i} className={styles.moduleCard} onClick={() => router.push(mod.path)}
            style={{ borderColor: `${mod.color}30` }}>
            <div className={styles.moduleIcon} style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
              <mod.icon size={28} />
            </div>
            <h3 className={styles.moduleTitle}>{mod.label}</h3>
            <ul className={styles.moduleList}>
              {mod.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className={styles.mainCard} style={{ marginTop: '1.5rem' }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Employees</h3>
          <button className={styles.viewAll} onClick={() => router.push('/employees')}>View All</button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr><th>Name</th><th>Department</th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              {employees.slice(0, 6).map(emp => (
                <tr key={emp._id}>
                  <td>
                    <div className={styles.userName}>
                      <div className={styles.userAvatar}>{emp.firstName[0]}{emp.lastName[0]}</div>
                      <span>{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  <td><span className={styles.deptTag}>{emp.department}</span></td>
                  <td><span className={styles.roleTag} style={{ color: emp.role === 'admin' ? '#4f46e5' : emp.role === 'manager' ? '#f59e0b' : '#10b981' }}>{emp.role}</span></td>
                  <td><span className={`${styles.status} ${styles[emp.status.toLowerCase().replace(' ', '')]}`}>{emp.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
