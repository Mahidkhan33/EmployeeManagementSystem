import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import SalaryRecord from '@/models/SalaryRecord';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  // Finance dept + admin can view payroll; employees can view their own
  const auth = authenticate(request, ['admin', 'manager', 'employee']);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');

    let employees;
    let recordsQuery: Record<string, unknown> = {};

    if (user.role !== 'admin' && user.department !== 'Finance') {
      // Regular employee: only their own data
      const emp = await Employee.findById(user.id);
      if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      employees = [emp];
      recordsQuery = { employeeId: emp._id };
    } else if (emailParam) {
      const employee = await Employee.findOne({ email: emailParam });
      if (!employee) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
      employees = [employee];
      recordsQuery = { employeeId: employee._id };
    } else {
      employees = await Employee.find({});
    }

    const records = await SalaryRecord.find(recordsQuery).sort({ paymentDate: -1, createdAt: -1 });

    const totalPayout = records.reduce((acc, rec) => acc + rec.amount, 0);
    const avgSalary = employees.length > 0
      ? employees.reduce((acc, emp) => acc + emp.salary, 0) / employees.length
      : 0;

    const formattedRecords = records.map(rec => ({
      _id: rec._id,
      name: rec.employeeName,
      amount: rec.amount,
      status: rec.status,
      date: new Date(rec.paymentDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),
      month: rec.month,
      method: rec.method
    }));

    const finalRecords = formattedRecords.length > 0 ? formattedRecords : employees.map(emp => ({
      _id: `v-${emp._id}`,
      name: `${emp.firstName} ${emp.lastName}`,
      amount: emp.salary / 12,
      status: 'Pending',
      date: 'N/A',
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      method: 'N/A'
    }));

    // Aggregate trends for charts
    const trend: Record<string, number> = {};
    records.forEach(rec => {
      trend[rec.month] = (trend[rec.month] || 0) + rec.amount;
    });
    const expenditureTrend = Object.entries(trend).map(([month, amount]) => ({ month, amount }));

    return NextResponse.json({
      data: {
        records: finalRecords,
        stats: {
          totalPayout,
          avgSalary: emailParam ? (employees[0]?.salary || 0) : avgSalary,
          pendingPayments: employees.filter(e => e.status === 'On Leave').length,
          expenditureTrend: (user.role === 'admin' || user.department === 'Finance') ? expenditureTrend : []
        }
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch salary data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Only Finance dept users and admins can run payroll
  const auth = authenticate(request, ['admin', 'manager'], ['Finance', 'Admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const employees = await Employee.find({ status: 'Active' });

    if (employees.length === 0) {
      return NextResponse.json({ error: 'No active employees found to process' }, { status: 400 });
    }

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const existingRecords = await SalaryRecord.find({
      month: currentMonth,
      employeeId: { $in: employees.map(e => e._id) }
    });

    const paidEmployeeIds = new Set(existingRecords.map(r => r.employeeId.toString()));
    const employeesToPay = employees.filter(emp => !paidEmployeeIds.has(emp._id.toString()));

    if (employeesToPay.length === 0) {
      return NextResponse.json({
        error: `Payroll for all active employees has already been processed for ${currentMonth}.`
      }, { status: 400 });
    }

    const payrollRecords = employeesToPay.map(emp => ({
      employeeId: emp._id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      amount: emp.salary / 12,
      month: currentMonth,
      status: 'Paid',
      method: 'Bank Transfer',
      paymentDate: new Date()
    }));

    await SalaryRecord.insertMany(payrollRecords);

    return NextResponse.json({
      message: `Successfully processed payroll for ${employeesToPay.length} employees for ${currentMonth}.`,
      count: employeesToPay.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process payroll';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
