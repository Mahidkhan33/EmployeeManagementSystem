'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const opts = optionsString ? JSON.parse(optionsString) : {};
    const stored = localStorage.getItem('ems_user');
    const token = localStorage.getItem('ems_token');

    if (!stored || !token) {
      router.push(opts.redirectTo || '/login');
      return;
    }

    const parsed: User = JSON.parse(stored);
    setUser(parsed);
    setLoading(false);

    if (opts.requiredRole) {
      const roles = Array.isArray(opts.requiredRole) ? opts.requiredRole : [opts.requiredRole];
      if (!roles.includes(parsed.role)) {
        router.push('/dashboard');
      }
    }

    if (opts.requiredDept) {
      const depts = Array.isArray(opts.requiredDept) ? opts.requiredDept : [opts.requiredDept];
      if (parsed.role !== 'admin' && !depts.includes(parsed.department)) {
        router.push('/dashboard');
      }
    }
  }, [router, optionsString]);

  const getAuthHeader = useCallback((): Record<string, string> => {
    const token = localStorage.getItem('ems_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return { user, loading, getAuthHeader };
}
