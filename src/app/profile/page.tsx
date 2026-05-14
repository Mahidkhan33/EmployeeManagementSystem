'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Phone, Mail, Building2, Briefcase, Calendar, Shield, Save } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string; email: string } | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [formData, setFormData] = useState({
    phone: '',
  });

  const fetchProfile = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/employees?email=${email}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const emp = data.data[0];
        setEmployeeData(emp);
        setFormData({
          phone: emp.phone || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser.email);
    }
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeData) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/employees/${employeeData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>View and manage your personal information</p>
        </header>

        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {employeeData?.firstName[0]}{employeeData?.lastName[0]}
              </div>
              <div className={styles.headerInfo}>
                <h2 className={styles.userName}>{employeeData?.firstName} {employeeData?.lastName}</h2>
                <span className={styles.userRole}>{employeeData?.position}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Contact Information</h3>
                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label><Mail size={16} /> Email Address</label>
                    <input type="email" value={employeeData?.email} disabled />
                    <p className={styles.hint}>Email cannot be changed. Contact admin for updates.</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <label><Phone size={16} /> Phone Number</label>
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
                <h3 className={styles.sectionTitle}>Job Details</h3>
                <div className={styles.grid}>
                  <div className={styles.infoBox}>
                    <div className={styles.infoLabel}><Building2 size={16} /> Department</div>
                    <div className={styles.infoValue}>{employeeData?.department}</div>
                  </div>
                  <div className={styles.infoBox}>
                    <div className={styles.infoLabel}><Briefcase size={16} /> Position</div>
                    <div className={styles.infoValue}>{employeeData?.position}</div>
                  </div>
                  <div className={styles.infoBox}>
                    <div className={styles.infoLabel}><Calendar size={16} /> Joining Date</div>
                    <div className={styles.infoValue}>
                      {employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className={styles.infoBox}>
                    <div className={styles.infoLabel}><Shield size={16} /> Account Status</div>
                    <div className={styles.infoValue}>
                      <span className={`${styles.status} ${styles[(employeeData?.status || 'active').toLowerCase().replace(' ', '')]}`}>
                        {employeeData?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
