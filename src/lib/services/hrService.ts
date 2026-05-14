import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function getHREmployees(callerDept: string) {
  await connectDB();
  const query = callerDept === 'Admin' ? {} : { department: 'HR' };
  return Employee.find(query).select('-password').sort({ createdAt: -1 });
}

export async function getDepartmentEmployees(department: string) {
  await connectDB();
  return Employee.find({ department }).select('-password').sort({ createdAt: -1 });
}

export async function getAttendanceSummary(department?: string) {
  await connectDB();
  const query = department ? { department } : {};
  const [total, active, onLeave, resigned] = await Promise.all([
    Employee.countDocuments(query),
    Employee.countDocuments({ ...query, status: 'Active' }),
    Employee.countDocuments({ ...query, status: 'On Leave' }),
    Employee.countDocuments({ ...query, status: 'Resigned' }),
  ]);
  return { total, active, onLeave, resigned };
}
