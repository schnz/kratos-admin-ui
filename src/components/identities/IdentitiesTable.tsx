import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useIdentities } from '../../lib/hooks/useKratos';
import { Identity } from '@ory/kratos-client';

const IdentitiesTable: React.FC = () => {
  const { data: identities, isLoading, isError, error } = useIdentities();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
        const date = params.row.created_at;
        return date ? new Date(date).toLocaleString() : 'N/A';
      }
    },
    { 
      field: 'updatedAt', 
      headerName: 'Updated At', 
      width: 200,
      valueGetter: (params) => {
        const date = params.row.updated_at;
        return date ? new Date(date).toLocaleString() : 'N/A';
      }
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">
          Error loading identities: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  const handleCreateIdentity = () => {
    // TODO: Implement create identity dialog
    console.log('Create identity clicked');
  };

  const handleSelectionChange = (selectionModel: any) => {
    setSelectedRows(selectionModel);
  };

  return (
    <Box sx={{ width: '100%', height: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Identities</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleCreateIdentity}
        >
          Create Identity
        </Button>
      </Box>
      <DataGrid
        rows={identities || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default IdentitiesTable;
