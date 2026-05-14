import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const department = await Department.findById(id);
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    return NextResponse.json({ data: department });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch department';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const department = await Department.findByIdAndUpdate(id, body, { new: true });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: department, message: 'Department updated successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update department';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete department';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
