import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Typography, CircularProgress, TextField, InputAdornment, IconButton, Tooltip, Paper } from '@mui/material';
import { Add, Search, Refresh } from '@mui/icons-material';
import { useIdentities } from '@/hooks/useKratos';
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
        email.toLowerCase().includes(searchLower) ||
        username.toLowerCase().includes(searchLower)
      );
    });
  }, [identities, searchTerm]);

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value.substring(0, 8)}...</span>
        </Tooltip>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250,
      valueGetter: (params) => {
        const traits = (params.row.traits as any);
        return traits?.email || 'N/A';
      }
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      width: 150,
      valueGetter: (params) => {
        const traits = (params.row.traits as any);
        return traits?.username || 'N/A';
      }
    },
    { 
      field: 'state', 
      headerName: 'State', 
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span style={{ 
            color: params.value === 'active' ? 'green' : 
                  params.value === 'inactive' ? 'red' : 'orange'
          }}>
            {params.value}
          </span>
        </Tooltip>
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 200,
      valueFormatter: (params) => {
        return new Date(params.value as string).toLocaleString();
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated', 
      width: 200,
      valueFormatter: (params) => {
        return new Date(params.value as string).toLocaleString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Button 
            variant="text" 
            size="small" 
            color="primary"
            onClick={() => handleViewDetails(params.row.id)}
          >
            View
          </Button>
          <Button 
            variant="text" 
            size="small" 
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleViewDetails = (id: string) => {
    console.log('View details for identity:', id);
    // Implement navigation to identity details page
  };

  const handleDelete = (id: string) => {
    console.log('Delete identity:', id);
    // Implement delete confirmation dialog and API call
  };

  const handleCreateNew = () => {
    console.log('Create new identity');
    // Implement navigation to create identity page
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">
          Error loading identities: {(error as any)?.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Identities
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage user identities in your Kratos instance.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search identities..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={handleCreateNew}
          >
            Create New
          </Button>
        </Box>
      </Box>

      <Box height={600} width="100%">
        <DataGrid
          rows={filteredIdentities}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection as string[]);
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default IdentitiesTable;
