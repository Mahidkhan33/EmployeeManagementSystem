"use client";

import { useState, useEffect } from 'react';
import { Users, Building2, Wallet, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Dashboard.module.css';
import { Employee } from '@/types';

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (data.data) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = employees.length;
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const avgSalary = totalEmployees > 0 
    ? employees.reduce((acc, emp) => acc + emp.salary, 0) / totalEmployees 
    : 0;

  const stats = [
    { label: 'Total Employees', value: totalEmployees.toString(), icon: Users, change: '+100%', color: '#4f46e5' },
    { label: 'Departments', value: departments.length.toString(), icon: Building2, change: '0%', color: '#10b981' },
    { label: 'Avg Salary', value: `$${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Wallet, change: '+5%', color: '#f59e0b' },
    { label: 'Growth Rate', value: '100%', icon: TrendingUp, change: '+2%', color: '#ef4444' },
  ];

  const recentEmployees = employees.slice(0, 5);

  const deptDistribution = departments.map(dept => {
    const count = employees.filter(emp => emp.department === dept).length;
    const percent = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;
    return { name: dept, count, percent };
  }).sort((a, b) => b.count - a.count);

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back, here's what's happening today.</p>
        </header>

        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <h2 className={styles.statValue}>{loading ? '...' : stat.value}</h2>
                <div className={styles.statTrend}>
                  <span className={styles.trendValue}>{stat.change}</span>
                  <span className={styles.trendLabel}>vs last month</span>
                </div>
              </div>
              <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.dashboardGrid}>
          <div className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Employees</h3>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td></tr>
                  ) : recentEmployees.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No records found.</td></tr>
                  ) : (
                    recentEmployees.map((emp) => (
                      <tr key={emp._id}>
                        <td>
                          <div className={styles.userName}>
                            <div className={styles.userAvatar}>{emp.firstName[0]}{emp.lastName[0]}</div>
                            <span>{emp.firstName} {emp.lastName}</span>
                          </div>
                        </td>
                        <td>{emp.department}</td>
                        <td>{emp.position}</td>
                        <td>
                          <span className={`${styles.status} ${styles[emp.status.toLowerCase().replace(' ', '')]}`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.sideCard}>
            <h3 className={styles.cardTitle}>Department Distribution</h3>
            <div className={styles.distributionList}>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '1rem' }}>Loading...</p>
              ) : deptDistribution.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '1rem' }}>No data available.</p>
              ) : (
                deptDistribution.map((dept) => (
                  <div key={dept.name} className={styles.deptItem}>
                    <div className={styles.deptInfo}>
                      <span>{dept.name}</span>
                      <span>{dept.count}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${dept.percent}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

