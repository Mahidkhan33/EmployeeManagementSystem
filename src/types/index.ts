export interface User {
  id: string;
  email: string;
  role: 'admin';
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
