'use client';

import { Box, Typography, Grid, Paper } from '@mui/material';
import { AdminLayout } from '@/components/templates/Admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { listIdentities, listSessions, listIdentitySchemas, checkKratosReady } from '@/lib/api/kratos/client';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/config/users';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { data: identities, isLoading: identitiesLoading } = useQuery({
    queryKey: ['identities'],
    queryFn: async () => {
      const response = await listIdentities();
      return response.data;
    },
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await listSessions(true);
      return response.data;
    },
  });

  const { data: schemas, isLoading: schemasLoading } = useQuery({
    queryKey: ['schemas'],
    queryFn: async () => {
      const response = await listIdentitySchemas();
      return response.data;
    },
  })

  const [kratosStatus, setKratosStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkKratosReady().then(status => setKratosStatus(status));
      checkKratosReady().then(status => console.log(status));
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute requiredRole={UserRole.VIEWER}>
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Identities
                </Typography>
                <Typography component="p" variant="h4">
                  {identitiesLoading ? '...' : identities?.length || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Total registered users
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Sessions
                </Typography>
                <Typography component="p" variant="h4">
                  {sessionsLoading ? '...' : sessions?.length || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Active sessions
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Schemas
                </Typography>
                <Typography component="p" variant="h4">
                  {schemasLoading ? '...' : schemas?.length || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Identity schemas
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  API Status
                </Typography>
                <Typography component="p" variant="h4">
                  {kratosStatus? 'Connected' : 'Disconnected'}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Kratos API connection
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </AdminLayout>
    </ProtectedRoute>
  );
}
