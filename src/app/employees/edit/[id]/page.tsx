"use client";

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import styles from './EditEmployee.module.css';
import { Employee } from '@/types';

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading, getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: '',
    status: 'Active',
    password: ''
  });

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    try {
      setFetching(true);
      const res = await fetch(`/api/employees/${id}`, {
        headers: getAuthHeader()
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const emp = data.data;
        setFormData({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone || '',
          department: emp.department,
          position: emp.position,
          salary: emp.salary.toString(),
          joiningDate: new Date(emp.joiningDate).toISOString().split('T')[0],
          status: emp.status,
          password: ''
        });
      } else {
        setError(data.error || 'Employee not found');
      }
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      setError('An error occurred while fetching the employee data.');
    } finally {
      setFetching(false);
    }
  }, [id, getAuthHeader]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        ...formData,
        salary: Number(formData.salary)
      };
      
      // Only include password if it was changed
      if (!formData.password) {
        delete updateData.password;
      }

      const token = localStorage.getItem('ems_token');
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        router.push('/employees');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update employee');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetching) return <DashboardLayout><div className={styles.loading}>Loading data...</div></DashboardLayout>;

  if (error) {
    return (
      <DashboardLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h2>{error}</h2>
            <p>We could not retrieve the employee record. Please ensure you have the correct permissions.</p>
            <Link href="/employees" className={styles.backBtn}>Back to Employees</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">
        <form onSubmit={handleSubmit}>
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              <Link href="/employees" className={styles.backBtn}>
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className={styles.title}>Edit Employee</h1>
                <p className={styles.subtitle}>Update information for {formData.firstName} {formData.lastName}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <Link href="/employees" className={styles.cancelBtn}>
                <X size={18} />
                <span>Cancel</span>
              </Link>
              <button type="submit" className={styles.saveBtn} disabled={loading}>
                <Save size={18} />
                <span>{loading ? 'Updating...' : 'Update Employee'}</span>
              </button>
            </div>
          </header>

          <div className={styles.form}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Job Information</h3>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Department</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="IT">IT</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Position</label>
                  <input 
                    type="text" 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Salary (Annual)</label>
                  <input 
                    type="number" 
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Login Credentials</h3>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>New Password (Leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
