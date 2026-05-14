'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/types';

export function useAuth(options?: {
  requiredRole?: UserRole | UserRole[];
  requiredDept?: string | string[];
  redirectTo?: string;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ems_user');
    const token = localStorage.getItem('ems_token');

    if (!stored || !token) {
      router.push(options?.redirectTo || '/login');
      return;
    }

    const parsed: User = JSON.parse(stored);
    setUser(parsed);
    setLoading(false);

    if (options?.requiredRole) {
      const roles = Array.isArray(options.requiredRole) ? options.requiredRole : [options.requiredRole];
      if (!roles.includes(parsed.role)) {
        router.push('/dashboard');
      }
    }

    if (options?.requiredDept) {
      const depts = Array.isArray(options.requiredDept) ? options.requiredDept : [options.requiredDept];
      if (parsed.role !== 'admin' && !depts.includes(parsed.department)) {
        router.push('/dashboard');
      }
    }
  }, [router, options?.requiredRole, options?.requiredDept, options?.redirectTo]);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('ems_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return { user, loading, getAuthHeader };
}
