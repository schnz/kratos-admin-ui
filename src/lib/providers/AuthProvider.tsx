'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useIsAuthenticated } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
