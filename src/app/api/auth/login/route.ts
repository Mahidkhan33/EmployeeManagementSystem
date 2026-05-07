import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    console.log('Login attempt started...');
    
    // Parse request body first
    const body = await request.json();
    const { email: userEmail, password } = body;
    console.log('Login attempt for:', userEmail);

    if (!userEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected.');

    // Seed admin if none exists
    console.log('Checking admin count...');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding admin...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@ems.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin seeded.');
    }

    console.log('Finding admin...');
    const admin = await Admin.findOne({ email: userEmail });
    if (!admin) {
      console.log('Admin not found:', userEmail);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password mismatch for:', userEmail);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Generating token...');
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', userEmail);
    return NextResponse.json({ 
      data: { 
        token, 
        admin: { id: admin._id, email: admin.email, role: admin.role } 
      },
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('CRITICAL LOGIN ERROR:', error.message);
    return NextResponse.json({ 
      error: 'Connection failed or internal error', 
      details: error.message 
    }, { status: 500 });
  }




}
