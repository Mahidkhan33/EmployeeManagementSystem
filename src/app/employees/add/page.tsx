"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './AddEmployee.module.css';

export default function AddEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    role: 'employee'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('ems_token');
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary)
        }),
      });

      if (res.ok) {
        router.push('/employees');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create employee');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className={styles.title}>Add New Employee</h1>
                <p className={styles.subtitle}>Fill in the information to create a new team member</p>
              </div>
            </div>
            <div className={styles.actions}>
              <Link href="/employees" className={styles.cancelBtn}>
                <X size={18} />
                <span>Cancel</span>
              </Link>
              <button type="submit" className={styles.saveBtn} disabled={loading}>
                <Save size={18} />
                <span>{loading ? 'Saving...' : 'Save Employee'}</span>
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
                    placeholder="e.g. John" 
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
                    placeholder="e.g. Doe" 
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
                    placeholder="john@example.com" 
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
                    placeholder="+1 (555) 000-0000" 
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
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Position</label>
                  <input 
                    type="text" 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Senior Developer" 
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
                    placeholder="e.g. 60000" 
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Joining Date</label>
                  <input 
                    type="date" 
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required 
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

