'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, Plus, FileText } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Employee } from '@/types';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export default function HRDashboard() {
  const { user, loading, getAuthHeader } = useAuth({ requiredDept: 'HR' });
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/employees', { headers: getAuthHeader() })
      .then(r => r.json())
      .then(data => {
        setEmployees(data.data || []);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user]);

  if (loading || fetching) return <div className={styles.loading}>Loading HR Dashboard...</div>;

  const total = employees.length;
  const active = employees.filter(e => e.status === 'Active').length;
  const onLeave = employees.filter(e => e.status === 'On Leave').length;
  const resigned = employees.filter(e => e.status === 'Resigned').length;

  // Dept distribution
  const deptMap: Record<string, number> = {};
  employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const deptDist = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  const cards = [
    { label: 'Total Headcount', value: total, icon: Users, color: '#4f46e5' },
    { label: 'Active Staff', value: active, icon: UserCheck, color: '#10b981' },
    { label: 'On Leave', value: onLeave, icon: Clock, color: '#f59e0b' },
    { label: 'Resigned', value: resigned, icon: UserX, color: '#ef4444' },
  ];

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#4f46e520', color: '#4f46e5' }}>
            <Users size={14} /> HR Department
          </div>
          <h1 className={styles.title}>HR Dashboard</h1>
          <p className={styles.subtitle}>Manage employees, attendance, and workforce analytics.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={() => router.push('/employees/add')}>
            <Plus size={16} /> Add Employee
          </button>
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

      <div className={styles.dashboardGrid}>
        {/* Employee List */}
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Employee Directory</h3>
            <button className={styles.viewAll} onClick={() => router.push('/employees')}>Manage All</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Department</th><th>Position</th><th>Status</th></tr>
              </thead>
              <tbody>
                {employees.slice(0, 8).map(emp => (
                  <tr key={emp._id} className={styles.clickableRow} onClick={() => router.push(`/employees/${emp._id}`)}>
                    <td>
                      <div className={styles.userName}>
                        <div className={styles.userAvatar}>{emp.firstName[0]}{emp.lastName[0]}</div>
                        <span>{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td><span className={styles.deptTag}>{emp.department}</span></td>
                    <td>{emp.position}</td>
                    <td><span className={`${styles.status} ${styles[emp.status.toLowerCase().replace(' ', '')]}`}>{emp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dept Distribution */}
        <div className={styles.sideCard}>
          <h3 className={styles.cardTitle}>Department Distribution</h3>
          <div className={styles.distributionList}>
            {deptDist.map(([dept, count]) => (
              <div key={dept} className={styles.deptItem}>
                <div className={styles.deptInfo}>
                  <span>{dept}</span>
                  <span>{count}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.quickLinks}>
              <button className={styles.linkBtn} onClick={() => router.push('/employees/add')}>
                <Plus size={14} /> Add Employee
              </button>
              <button className={styles.linkBtn} onClick={() => router.push('/departments')}>
                <FileText size={14} /> Departments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
