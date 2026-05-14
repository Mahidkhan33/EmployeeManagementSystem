"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import HRDashboard from '@/components/dashboards/HRDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import SalesDashboard from '@/components/dashboards/SalesDashboard';
import ITDashboard from '@/components/dashboards/ITDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import type { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ems_user');
    const token = localStorage.getItem('ems_token');

    if (!stored || !token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(stored));
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const renderDashboard = () => {
    if (!user) return null;

    if (user.role === 'admin') return <AdminDashboard />;

    switch (user.department) {
      case 'HR':    return <HRDashboard />;
      case 'Finance': return <FinanceDashboard />;
      case 'Sales': return <SalesDashboard />;
      case 'IT':    return <ITDashboard />;
      default:      return <EmployeeDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
