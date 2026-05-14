import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = authenticate(request, ['admin', 'manager', 'employee']);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    let query: Record<string, string> = {};

    if (user.role === 'admin' || (user.role === 'manager' && user.department === 'HR')) {
      if (department) query.department = department;
    } else if (user.role === 'manager') {
      query.department = user.department;
    } else {
      query = { _id: user.id } as unknown as Record<string, string>;
    }

    const employees = await Employee.find(query).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ data: employees });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch employees';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = authenticate(request, ['admin', 'manager']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const password = body.password || 'employee123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      ...body,
      password: hashedPassword,
      role: body.role || 'employee',
    });
    return NextResponse.json({ data: employee, message: 'Employee created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
