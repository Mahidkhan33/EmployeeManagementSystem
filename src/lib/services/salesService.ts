import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function getSalesTeam() {
  await connectDB();
  return Employee.find({ department: 'Sales', status: 'Active' }).select('-password');
}

export async function getSalesSummary() {
  await connectDB();
  const [total, active, onLeave] = await Promise.all([
    Employee.countDocuments({ department: 'Sales' }),
    Employee.countDocuments({ department: 'Sales', status: 'Active' }),
    Employee.countDocuments({ department: 'Sales', status: 'On Leave' }),
  ]);

  const monthlyRevenue = [42000, 53000, 48000, 61000, 55000, 72000];
  const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
  const avgMonthly = totalRevenue / monthlyRevenue.length;

  return {
    teamSize: total,
    activeReps: active,
    onLeave,
    totalRevenue,
    avgMonthly,
    monthlyRevenue,
  };
}
