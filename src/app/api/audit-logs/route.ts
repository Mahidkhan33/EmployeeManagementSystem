import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  // Only admin can view audit logs
  const auth = authenticate(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit);

    return NextResponse.json({ data: logs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch audit logs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
