"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import styles from './Employees.module.css';
import { Employee } from '@/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ems_token');
      const res = await fetch('/api/employees', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.data) {
        setEmployees(data.data);
      } else {
        setError(data.error || 'Failed to fetch employees');
      }
    } catch {
      setError('An error occurred while fetching employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('ems_token');
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setEmployees(employees.filter(emp => emp._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete employee');
      }
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Employees</h1>
            <p className={styles.subtitle}>Manage your team members and their information</p>
          </div>
          <Link href="/employees/add" className={styles.addBtn}>
            <Plus size={20} />
            <span>Add Employee</span>
          </Link>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Search by name, email, department..." />
          </div>
          <div className={styles.actions}>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button className={styles.exportBtn}>
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading employees...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No employees found. Add one to get started!</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div className={styles.empInfo}>
                          <div className={styles.avatar}>
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <div className={styles.name}>{emp.firstName} {emp.lastName}</div>
                            <div className={styles.email}>{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>${emp.salary.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.status} ${styles[emp.status.toLowerCase().replace(' ', '')]}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <Link href={`/employees/${emp._id}`} title="View">
                            <Eye size={18} />
                          </Link>
                          <Link href={`/employees/edit/${emp._id}`} title="Edit">
                            <Edit2 size={18} />
                          </Link>
                          <button 
                            title="Delete" 
                            className={styles.delete}
                            onClick={() => handleDelete(emp._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing <span>{employees.length > 0 ? 1 : 0}</span> to <span>{employees.length}</span> of <span>{employees.length}</span> employees
            </div>
            <div className={styles.paginationBtns}>
              <button disabled><ChevronLeft size={20} /></button>
              <button className={styles.pageBtnActive}>1</button>
              <button disabled><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

