import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';
import Employee from '@/models/Employee';

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find({});
    
    // Enrich with employee counts if needed, though model has employeeCount
    // Let's also calculate real counts from Employee collection to be sure
    const enrichedDepartments = await Promise.all(departments.map(async (dept) => {
      const count = await Employee.countDocuments({ department: dept.name });
      return {
        ...dept.toObject(),
        employeeCount: count
      };
    }));
    
    return NextResponse.json({ data: enrichedDepartments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch departments';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }
    
    const department = await Department.create(body);
    return NextResponse.json({ data: department, message: 'Department created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create department';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
