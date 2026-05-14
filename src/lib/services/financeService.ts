import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import SalaryRecord from '@/models/SalaryRecord';

export async function getPayrollSummary() {
  await connectDB();
  const employees = await Employee.find({ status: 'Active' }).select('firstName lastName salary department');
  const records = await SalaryRecord.find({}).sort({ paymentDate: -1 });

  const totalPayout = records.reduce((acc, r) => acc + r.amount, 0);
  const avgSalary = employees.length > 0
    ? employees.reduce((acc, e) => acc + e.salary, 0) / employees.length
    : 0;

  const deptBreakdown: Record<string, { total: number; count: number }> = {};
  for (const emp of employees) {
    if (!deptBreakdown[emp.department]) deptBreakdown[emp.department] = { total: 0, count: 0 };
    deptBreakdown[emp.department].total += emp.salary;
    deptBreakdown[emp.department].count += 1;
  }

  return {
    totalPayout,
    avgSalary,
    employeeCount: employees.length,
    recentRecords: records.slice(0, 10),
    deptBreakdown
  };
}

export async function getEmployeeSalary(employeeId: string) {
  await connectDB();
  const employee = await Employee.findById(employeeId).select('-password');
  if (!employee) return null;
  const records = await SalaryRecord.find({ employeeId }).sort({ paymentDate: -1 });
  return { employee, records };
}

export async function getExpenditureTrend() {
  await connectDB();
  const records = await SalaryRecord.find({}).sort({ paymentDate: 1 });
  const trend: Record<string, number> = {};
  
  records.forEach(rec => {
    trend[rec.month] = (trend[rec.month] || 0) + rec.amount;
  });

  return Object.entries(trend).map(([month, amount]) => ({ month, amount }));
}
