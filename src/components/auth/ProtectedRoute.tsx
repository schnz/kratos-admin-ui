'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated, useHasPermission } from '@/lib/stores/authStore';
import { UserRole } from '@/lib/config/users';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const hasPermission = useHasPermission();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // If role is required and user doesn't have permission, redirect to dashboard
    if (requiredRole && !hasPermission(requiredRole)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, hasPermission, requiredRole, router]);
  
  // If not authenticated or doesn't have required permission, don't render children
  if (!isAuthenticated || (requiredRole && !hasPermission(requiredRole))) {
    return null;
  }
  
  // Render children if authenticated and has required permission
  return <>{children}</>;
}
