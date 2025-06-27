'use client';

import { Box, Typography, Grid, Paper } from '@mui/material';
import { AdminLayout } from '@/components/templates/Admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { listIdentities, listSessions, listIdentitySchemas, checkKratosReady } from '@/lib/api/kratos/client';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/config/users';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  // Fetch multiple pages to get accurate total count
  const { data: identitiesData, isLoading: identitiesLoading } = useQuery({
    queryKey: ['identities-total-count'],
    queryFn: async () => {
      let allIdentities: any[] = [];
      let pageToken = undefined;
      let hasMore = true;
      let pageCount = 0;
      const maxPages = 20; // Allow up to 20 pages (20 * 250 = 5,000 identities)
      
      console.log('Starting identity count fetch...');
      
      while (hasMore && pageCount < maxPages) {
        console.log(`Fetching page ${pageCount + 1} with token: ${pageToken}`);
        
        try {
          const requestParams: any = { 
            pageSize: 250, // Use max that works - API rejects 500
          };
          
          // Only add pageToken if it's not the first page
          if (pageToken) {
            requestParams.pageToken = pageToken;
          }
          
          const response = await listIdentities(requestParams);
          
          console.log(`Page ${pageCount + 1}: Got ${response.data.length} identities`);
          allIdentities = [...allIdentities, ...response.data];
          
          // Extract next page token from Link header
          const linkHeader = response.headers?.link;
          let nextPageToken = null;
          
          if (linkHeader) {
            const nextMatch = linkHeader.match(/page_token=([^&>]+)[^>]*>;\s*rel="next"/);
            if (nextMatch) {
              nextPageToken = nextMatch[1];
            }
          }
          
          hasMore = !!nextPageToken;
          pageToken = nextPageToken || "";
          pageCount++;
          
          console.log(`Next token: ${nextPageToken}, Has more: ${hasMore}`);
          
          // Small delay to avoid overwhelming the API
          if (hasMore) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Error fetching page ${pageCount + 1}:`, error);
          hasMore = false; // Stop on error
        }
      }
      
      console.log(`Total identities fetched: ${allIdentities.length}`);
      
      return {
        identities: allIdentities,
        totalCount: allIdentities.length,
        isEstimate: hasMore // If we stopped due to maxPages, it's an estimate
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  const identities = identitiesData?.identities || [];
  const totalCount = identitiesData?.totalCount || 0;
  const isEstimate = identitiesData?.isEstimate || false;

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
                  {identitiesLoading ? '...' : `${totalCount}${isEstimate ? '+' : ''}`}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  {isEstimate ? 'Registered users (estimated)' : 'Total registered users'}
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
