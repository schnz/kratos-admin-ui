'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh'
    }}>
      <CircularProgress size={40} />
      <Typography sx={{ mt: 2 }}>
        Redirecting to dashboard...
      </Typography>
    </Box>
  );
}
