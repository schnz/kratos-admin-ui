'use client';

import { AdminLayout } from '../../components/layouts/AdminLayout';
import IdentitiesTable from '../../components/identities/IdentitiesTable';

export default function IdentitiesPage() {
  return (
    <AdminLayout>
      <IdentitiesTable />
    </AdminLayout>
  );
}
