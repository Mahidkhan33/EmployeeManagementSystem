"use client";

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Edit2, Mail, Phone, MapPin, Building2, Calendar, Wallet } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import styles from './ViewEmployee.module.css';
import { Employee } from '@/types';

export default function ViewEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading, getAuthHeader } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/employees/${id}`, {
        headers: getAuthHeader()
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setEmployee(data.data);
      } else {
        setError(data.error || 'Employee not found');
      }
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      setError('An error occurred while fetching the employee profile.');
    } finally {
      setLoading(false);
    }
  }, [id, getAuthHeader]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  if (authLoading || loading) return <DashboardLayout><div className={styles.loading}>Loading profile...</div></DashboardLayout>;
  
  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h2>{error || 'Employee Not Found'}</h2>
            <p>The employee record you are looking for does not exist or you do not have permission to view it.</p>
            <Link href="/employees" className={styles.backBtn}>Back to Employees</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <Link href="/employees" className={styles.backBtn}>
            <ChevronLeft size={20} />
            <span>Back to Employees</span>
          </Link>
          <Link href={`/employees/edit/${id}`} className={styles.editBtn}>
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </Link>
        </header>

        <div className={styles.profileCard}>
          <div className={styles.cover}></div>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{employee.firstName} {employee.lastName}</h1>
              <p className={styles.position}>{employee.position} • {employee.department}</p>
            </div>
            <div className={`${styles.status} ${styles[employee.status.toLowerCase().replace(' ', '')]}`}>
              {employee.status}
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Mail size={18} />
                  <div>
                    <label>Email Address</label>
                    <p>{employee.email}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={18} />
                  <div>
                    <label>Phone Number</label>
                    <p>{employee.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <MapPin size={18} />
                  <div>
                    <label>Location</label>
                    <p>New York, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Employment Details</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Building2 size={18} />
                  <div>
                    <label>Department</label>
                    <p>{employee.department}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={18} />
                  <div>
                    <label>Joining Date</label>
                    <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Wallet size={18} />
                  <div>
                    <label>Annual Salary</label>
                    <p>${employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
