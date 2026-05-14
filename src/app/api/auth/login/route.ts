import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: userEmail, password } = body;

    if (!userEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();
    const user = await Employee.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Account not set up for login. Please contact admin.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        department: user.department 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    await logAction({
      userId: user._id.toString(),
      userEmail: user.email,
      action: 'LOGIN',
      details: `User logged in with role ${user.role} and department ${user.department}`
    });

    console.log('Login successful for:', userEmail);
    return NextResponse.json({ 
      data: { 
        token, 
        user: { 
          id: user._id, 
          email: user.email, 
          role: user.role,
          department: user.department,
          name: `${user.firstName} ${user.lastName}`
        } 
      },
      message: 'Login successful'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown login error';
    console.error('CRITICAL LOGIN ERROR:', message);
    return NextResponse.json({ 
      error: 'Connection failed or internal error', 
      details: message 
    }, { status: 500 });
  }
}
