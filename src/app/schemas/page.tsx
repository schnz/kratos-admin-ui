'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Chip } from '@mui/material';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { listIdentitySchemas, getIdentitySchema } from '../../lib/kratos/client';
import { Code, Description } from '@mui/icons-material';

// Define the schema interface based on the provided example
interface SchemaItem {
  id: string;
  schema: {
    $id?: string;
    title?: string;
    type?: string;
    properties?: any;
    // Add other properties as needed
  };
}

export default function SchemasPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [schemaDialogOpen, setSchemaDialogOpen] = useState(false);
  const [schemaContent, setSchemaContent] = useState<any>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [parsedSchemas, setParsedSchemas] = useState<SchemaItem[]>([]);

  const { data: schemasResponse, isLoading, error } = useQuery({
    queryKey: ['schemas'],
    queryFn: async () => {
      const response = await listIdentitySchemas();
      return response.data;
    },
  });

  // Use useEffect to parse the schemas when the response changes
  useEffect(() => {
    if (schemasResponse) {
      
      // Check if the response has a json property
      if (schemasResponse.json && Array.isArray(schemasResponse.json)) {
        setParsedSchemas(schemasResponse.json);
      } else {
        // If not, try to use the response directly if it's an array
        setParsedSchemas(Array.isArray(schemasResponse) ? schemasResponse : []);
      }
    }
  }, [schemasResponse]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewSchema = async (id: string) => {
    setSelectedSchemaId(id);
    setSchemaLoading(true);
    setSchemaDialogOpen(true);
    
    try {
      // First try to find the schema in the already loaded data
      const existingSchema = parsedSchemas.find(schema => schema.id === id);
      
      if (existingSchema) {
        setSchemaContent(existingSchema.schema);
        setSchemaLoading(false);
        return;
      }
      
      // If not found, fetch it from the API
      const response = await getIdentitySchema({ id });
      setSchemaContent(response.data);
    } catch (err) {
      console.error('Error fetching schema:', err);
      setSchemaContent(null);
    } finally {
      setSchemaLoading(false);
    }
  };

  const handleCloseSchemaDialog = () => {
    setSchemaDialogOpen(false);
    setSelectedSchemaId(null);
    setSchemaContent(null);
  };

  // Extract schema title or use ID if title is not available
  const getSchemaTitle = (schema: SchemaItem) => {
    return schema.schema.title || 'Unnamed Schema';
  };

  // Get schema properties count
  const getPropertiesCount = (schema: SchemaItem) => {
    const traits = schema.schema.properties?.traits?.properties;
    return traits ? Object.keys(traits).length : 0;
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Identity Schemas
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">Error loading schemas. Please try again later.</Typography>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="schemasTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Properties</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedSchemas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No schemas found
                          {schemasResponse && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption">Debug: Raw Response</Typography>
                              <pre style={{ fontSize: '0.7rem', maxHeight: '100px', overflow: 'auto' }}>
                                {JSON.stringify(schemasResponse, null, 2)}
                              </pre>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      parsedSchemas
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((schema) => (
                          <TableRow key={schema.id}>
                            <TableCell component="th" scope="row">
                              {schema.id}
                            </TableCell>
                            <TableCell>{getSchemaTitle(schema)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={schema.schema.type || 'unknown'} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {getPropertiesCount(schema)} trait(s)
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Code />}
                                onClick={() => handleViewSchema(schema.id)}
                                sx={{ mr: 1 }}
                              >
                                View Schema
                              </Button>
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
                count={parsedSchemas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Identity schemas define the structure of identity data in Ory Kratos. They determine what fields are available for registration, login, and profile management.
        </Typography>
        
        {/* Schema Dialog */}
        <Dialog
          open={schemaDialogOpen}
          onClose={handleCloseSchemaDialog}
          aria-labelledby="schema-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="schema-dialog-title">
            Schema Details {selectedSchemaId && `(ID: ${selectedSchemaId})`}
          </DialogTitle>
          <DialogContent dividers>
            {schemaLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : schemaContent ? (
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2, 
                borderRadius: 1, 
                overflow: 'auto',
                maxHeight: '60vh'
              }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(schemaContent, null, 2)}
                </pre>
              </Box>
            ) : (
              <Typography color="error">
                Failed to load schema content. Please try again.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSchemaDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
