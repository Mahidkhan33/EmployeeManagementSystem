"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Layout, MoreVertical, X, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Departments.module.css';
import { Department, Employee } from '@/types';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<Employee[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      if (data.data) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleViewDetails = async (dept: Department) => {
    setSelectedDept(dept);
    setFetchingEmployees(true);
    try {
      const res = await fetch(`/api/employees?department=${encodeURIComponent(dept.name)}`);
      const data = await res.json();
      if (data.data) {
        setDeptEmployees(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch department employees:', error);
    } finally {
      setFetchingEmployees(false);
    }
  };

  const handleSetHead = async (employeeName: string) => {
    if (!selectedDept) return;
    
    try {
      const res = await fetch(`/api/departments/${selectedDept._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ head: employeeName }),
      });

      if (res.ok) {
        // Refresh data
        fetchDepartments();
        setSelectedDept(prev => prev ? { ...prev, head: employeeName } : null);
      }
    } catch (error) {
      console.error('Failed to update department head:', error);
    }
  };

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
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem' }}>Loading departments...</div>
          ) : departments.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem' }}>No departments found.</div>
          ) : (
            departments.map((dept, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div key={dept._id} className={styles.card} onClick={() => handleViewDetails(dept)}>
                  <div className={styles.cardTop}>
                    <div className={styles.iconBox} style={{ backgroundColor: `${color}15`, color: color }}>
                      <Layout size={24} />
                    </div>
                    <button className={styles.moreBtn} onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  
                  <h3 className={styles.deptName}>{dept.name}</h3>
                  
                  <div className={styles.stats}>
                    <div className={styles.statItem}>
                      <Users size={16} />
                      <span>{dept.employeeCount} Employees</span>
                    </div>
                  </div>

                  <div className={styles.headInfo}>
                    <span className={styles.label}>Department Head</span>
                    <div className={styles.headUser}>
                      <div className={styles.headAvatar}>
                        {dept.head ? dept.head.split(' ').map(n => n[0]).join('') : 'NA'}
                      </div>
                      <span className={styles.headName}>{dept.head || 'Not Assigned'}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button className={styles.viewBtn}>View Details</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedDept && (
          <div className={styles.modalOverlay} onClick={() => setSelectedDept(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <header className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedDept.name} Department</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedDept(null)}>
                  <X size={24} />
                </button>
              </header>
              <div className={styles.modalBody}>
                <div className={styles.detailSection}>
                  <span className={styles.sectionLabel}>Employees ({deptEmployees.length})</span>
                  <div className={styles.employeeList}>
                    {fetchingEmployees ? (
                      <p>Loading employees...</p>
                    ) : deptEmployees.length === 0 ? (
                      <p>No employees in this department.</p>
                    ) : (
                      deptEmployees.map(emp => {
                        const isHead = selectedDept.head === `${emp.firstName} ${emp.lastName}`;
                        return (
                          <div key={emp._id} className={styles.employeeItem}>
                            <div className={styles.employeeInfo}>
                              <div className={styles.empAvatar}>
                                {emp.firstName[0]}{emp.lastName[0]}
                              </div>
                              <div className={styles.empDetails}>
                                <h4>{emp.firstName} {emp.lastName}</h4>
                                <p>{emp.position}</p>
                              </div>
                            </div>
                            {isHead ? (
                              <div className={styles.currentHeadBadge}>
                                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                Head
                              </div>
                            ) : (
                              <button 
                                className={styles.setHeadBtn}
                                onClick={() => handleSetHead(`${emp.firstName} ${emp.lastName}`)}
                              >
                                Set as Head
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
