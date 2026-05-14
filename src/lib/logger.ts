import connectDB from './mongodb';
import AuditLog from '@/models/AuditLog';

export async function logAction(data: {
  userId: string;
  userEmail: string;
  action: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await connectDB();
    await AuditLog.create(data);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
