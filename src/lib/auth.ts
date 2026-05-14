import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'manager' | 'employee';
export type Department = 'HR' | 'Finance' | 'Sales' | 'IT' | 'Admin';

export interface JWTPayload {
  id: string;
  role: Role;
  department: Department;
  iat?: number;
  exp?: number;
}

export function verifyToken(request: Request): JWTPayload | NextResponse {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized – missing token' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;
    return decoded;
  } catch {
    return NextResponse.json({ error: 'Unauthorized – invalid or expired token' }, { status: 401 });
  }
}

export function requireRole(user: JWTPayload, allowed: Role[]): NextResponse | null {
  if (!allowed.includes(user.role)) {
    return NextResponse.json(
      { error: `Forbidden – requires one of: ${allowed.join(', ')}` },
      { status: 403 }
    );
  }
  return null;
}

export function requireDepartment(user: JWTPayload, allowed: Department[]): NextResponse | null {
  if (user.role === 'admin') return null;
  if (!allowed.includes(user.department)) {
    return NextResponse.json(
      { error: `Forbidden – this feature is restricted to: ${allowed.join(', ')}` },
      { status: 403 }
    );
  }
  return null;
}

export function authenticate(
  request: Request,
  allowedRoles?: Role[],
  allowedDepts?: Department[]
): { user: JWTPayload } | NextResponse {
  const result = verifyToken(request);
  if (result instanceof NextResponse) return result;

  const user = result as JWTPayload;

  if (allowedRoles) {
    const roleError = requireRole(user, allowedRoles);
    if (roleError) return roleError;
  }

  if (allowedDepts) {
    const deptError = requireDepartment(user, allowedDepts);
    if (deptError) return deptError;
  }

  return { user };
}
