export type UserRole = 'admin' | 'manager' | 'employee';
export type DepartmentName = 'HR' | 'Finance' | 'Sales' | 'IT' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: DepartmentName;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  salary: number;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  role: UserRole;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  head?: string;
  employeeCount: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
