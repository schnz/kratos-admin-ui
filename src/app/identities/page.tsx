'use client';

import { Box } from '@mui/material';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import IdentitiesTable from '../../components/identities/IdentitiesTable';

export default function IdentitiesPage() {
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <IdentitiesTable />
      </Box>
    </AdminLayout>
  );
}
