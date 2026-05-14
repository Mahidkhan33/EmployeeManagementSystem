import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import { authenticate } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticate(request, ['admin', 'manager', 'employee']);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  try {
    await connectDB();
    const { id } = await params;

    if (user.role === 'employee' && user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const employee = await Employee.findById(id).select('-password');
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ data: employee });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch employee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticate(request, ['admin', 'manager']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ data: employee, message: 'Employee updated successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update employee';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticate(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const { id } = await params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete employee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
