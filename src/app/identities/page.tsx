'use client';

import { AdminLayout } from '../../components/layouts/AdminLayout';
import IdentitiesTable from '../../components/identities/IdentitiesTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/stores/authStore';

export default function IdentitiesPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminLayout>
        <IdentitiesTable />
      </AdminLayout>
    </ProtectedRoute>
  );
}
