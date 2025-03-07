import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Typography, CircularProgress, Card, CardContent, TextField, InputAdornment, IconButton, Tooltip, Paper } from '@mui/material';
import { Add, Search, Refresh } from '@mui/icons-material';
import { useIdentities } from '../../lib/hooks/useKratos';
import { Identity } from '@ory/kratos-client';

const IdentitiesTable: React.FC = () => {
  const { data: identities, isLoading, isError, error, refetch } = useIdentities();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIdentities = React.useMemo(() => {
    if (!identities) return [];
    
    return identities.filter((identity: Identity) => {
      const searchLower = searchTerm.toLowerCase();
      const traits = identity.traits as any;
      const email = traits?.email || '';
      const username = traits?.username || '';
      
      return (
        identity.id.toLowerCase().includes(searchLower) ||
        (email && email.toLowerCase().includes(searchLower)) ||
        (username && username.toLowerCase().includes(searchLower)) ||
        identity.schema_id.toLowerCase().includes(searchLower)
      );
    });
  }, [identities, searchTerm]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    { 
      field: 'schemaId', 
      headerName: 'Schema', 
      width: 150,
      valueGetter: (params) => params.row.schema_id 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250,
      valueGetter: (params) => {
        const traits = params.row.traits;
        return traits?.email || 'N/A';
      }
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      width: 150,
      valueGetter: (params) => {
        const traits = params.row.traits;
        return traits?.username || 'N/A';
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 200,
      valueGetter: (params) => {
        return new Date(params.row.created_at).toLocaleString();
      }
    },
    { 
      field: 'updatedAt', 
      headerName: 'Updated At', 
      width: 200,
      valueGetter: (params) => {
        return new Date(params.row.updated_at).toLocaleString();
      }
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading identities: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ mb: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Identities
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh identities">
                <IconButton onClick={() => refetch()}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                sx={{ 
                  borderRadius: 'var(--radius)',
                  textTransform: 'none',
                }}
              >
                Create Identity
              </Button>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search identities by ID, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Paper sx={{ 
            height: 600, 
            width: '100%',
            boxShadow: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--table-header)',
              borderBottom: '1px solid var(--table-border)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--table-border)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'var(--table-row-hover)',
            },
          }}>
            <DataGrid
              rows={filteredIdentities}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection as string[]);
              }}
              components={{
                Toolbar: GridToolbar,
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50, 100]}
            />
          </Paper>
        </CardContent>
      </Card>
      
      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About Identities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Identities represent users in your system. Each identity is associated with a schema that defines its structure.
            You can manage user accounts, view their details, and perform administrative actions from this page.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IdentitiesTable;
