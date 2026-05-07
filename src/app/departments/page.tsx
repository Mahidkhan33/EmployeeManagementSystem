import { Plus, Users, Layout, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Departments.module.css';

const departments = [
  { id: 1, name: 'Engineering', count: 145, head: 'John Doe', color: '#4f46e5' },
  { id: 2, name: 'Marketing', count: 42, head: 'Jane Smith', color: '#10b981' },
  { id: 3, name: 'Sales', count: 38, head: 'Robert Fox', color: '#f59e0b' },
  { id: 4, name: 'Human Resources', count: 12, head: 'Esther Howard', color: '#ef4444' },
  { id: 5, name: 'Design', count: 15, head: 'Cody Fisher', color: '#8b5cf6' },
  { id: 6, name: 'Customer Support', count: 28, head: 'Leslie Alexander', color: '#06b6d4' },
];

export default function DepartmentsPage() {
  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Departments</h1>
            <p className={styles.subtitle}>Organize your team by departments and leads</p>
          </div>
          <button className={styles.addBtn}>
            <Plus size={20} />
            <span>New Department</span>
          </button>
        </header>

        <div className={styles.grid}>
          {departments.map((dept) => (
            <div key={dept.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                  <Layout size={24} />
                </div>
                <button className={styles.moreBtn}>
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 className={styles.deptName}>{dept.name}</h3>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <Users size={16} />
                  <span>{dept.count} Employees</span>
                </div>
              </div>

              <div className={styles.headInfo}>
                <span className={styles.label}>Department Head</span>
                <div className={styles.headUser}>
                  <div className={styles.headAvatar}>
                    {dept.head.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className={styles.headName}>{dept.head}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.viewBtn}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
