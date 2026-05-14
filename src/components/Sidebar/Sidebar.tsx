'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  UserCircle,
  TrendingUp,
  Monitor,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { User } from '@/types';

/**
 * menuConfig — department-specific navigation items.
 * Keys match department values from the enum.
 * Each item has optional role restriction.
 */
const menuConfig: Record<string, { icon: React.ElementType; label: string; href: string }[]> = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users,           label: 'Employees',  href: '/employees' },
    { icon: Building2,       label: 'Departments', href: '/departments' },
    { icon: Wallet,          label: 'Payroll',     href: '/salary' },
    { icon: ShieldAlert,     label: 'Audit Logs',  href: '/settings/audit-logs' },
    { icon: ShieldCheck,     label: 'Settings',    href: '/settings' },
  ],
  HR: [
    { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
    { icon: Users,           label: 'Employees',   href: '/employees' },
    { icon: Building2,       label: 'Departments', href: '/departments' },
    { icon: UserCircle,      label: 'My Profile',  href: '/profile' },
    { icon: Settings,        label: 'Settings',    href: '/settings' },
  ],
  Finance: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Wallet,          label: 'Payroll',   href: '/salary' },
    { icon: UserCircle,      label: 'My Profile',href: '/profile' },
    { icon: Settings,        label: 'Settings',  href: '/settings' },
  ],
  Sales: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: TrendingUp,      label: 'Pipeline',  href: '/dashboard' },
    { icon: UserCircle,      label: 'My Profile',href: '/profile' },
    { icon: Settings,        label: 'Settings',  href: '/settings' },
  ],
  IT: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Monitor,         label: 'IT Team',   href: '/employees' },
    { icon: UserCircle,      label: 'My Profile',href: '/profile' },
    { icon: Settings,        label: 'Settings',  href: '/settings' },
  ],
  employee: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Wallet,          label: 'My Salary', href: '/salary' },
    { icon: UserCircle,      label: 'My Profile',href: '/profile' },
    { icon: Settings,        label: 'Settings',  href: '/settings' },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    router.push('/login');
  };

  // Select menu based on role then department
  const getMenuItems = () => {
    if (!user) return menuConfig.employee;
    if (user.role === 'admin') return menuConfig.admin;
    if (user.role === 'manager') return menuConfig[user.department] || menuConfig.employee;
    return menuConfig[user.department] || menuConfig.employee;
  };

  const items = getMenuItems();

  // Dept color accent
  const deptColor: Record<string, string> = {
    admin: '#4f46e5', HR: '#4f46e5', Finance: '#10b981',
    Sales: '#f59e0b', IT: '#6366f1', Admin: '#4f46e5'
  };
  const accentColor = user ? (deptColor[user.role === 'admin' ? 'admin' : user.department] || '#4f46e5') : '#4f46e5';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} style={{ backgroundColor: accentColor }}>
          <Users size={24} color="white" />
        </div>
        <div>
          <span className={styles.logoText}>EMS Portal</span>
          {user && (
            <span className={styles.logoDept} style={{ color: accentColor }}>
              {user.role === 'admin' ? 'Admin' : user.department}
            </span>
          )}
        </div>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              style={isActive ? { borderColor: accentColor, color: accentColor } : {}}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={16} className={styles.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar} style={{ backgroundColor: accentColor }}>
            {user.name?.[0] || 'U'}
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole} style={{ color: accentColor }}>
              {user.role === 'admin' ? 'Administrator' : `${user.department} · ${user.role}`}
            </span>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
