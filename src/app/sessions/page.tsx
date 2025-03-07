'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, CircularProgress, Alert } from '@mui/material';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { listSessions } from '../../lib/kratos/client';

// Define interfaces for type safety
interface Session {
  id: string;
  active: boolean;
  authenticated_at: string;
  expires_at: string;
  identity: {
    id: string;
    traits?: {
      email?: string;
      username?: string;
      [key: string]: any;
    };
  };
  issued_at: string;
}

export default function SessionsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all sessions directly using the listSessions method
  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await listSessions();
        return response.data;
      } catch (err) {
        console.error('Error fetching sessions:', err);
        throw err;
      }
    },
  });

  const sessions: Session[] = sessionsData || [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper to get identity display name
  const getIdentityDisplay = (session: Session) => {
    if (!session.identity) return 'Unknown';
    
    const traits = session.identity.traits;
    if (!traits) return session.identity.id;
    
    return traits.email || traits.username || session.identity.id;
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Active Sessions
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">Error loading sessions. Please try again later.</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="sessionsTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>Session ID</TableCell>
                      <TableCell>Identity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Authenticated At</TableCell>
                      <TableCell>Expires At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No active sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((session) => (
                          <TableRow key={session.id}>
                            <TableCell component="th" scope="row" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {session.id}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {getIdentityDisplay(session)}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={session.active ? 'Active' : 'Inactive'} 
                                color={session.active ? 'success' : 'default'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              {session.authenticated_at ? new Date(session.authenticated_at).toLocaleString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {session.expires_at ? new Date(session.expires_at).toLocaleString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sessions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          This page shows all active sessions across all identities in the system. Sessions are automatically created when users authenticate and expire based on your Kratos configuration.
        </Typography>
      </Box>
    </AdminLayout>
  );
}
