import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import { Settings as SettingsIcon, RestartAlt as ResetIcon, Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useKratosEndpoints, useSetKratosEndpoints, useResetSettings, useIsValidUrl } from '../hooks/useSettings';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SettingsForm {
  publicUrl: string;
  adminUrl: string;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const kratosEndpoints = useKratosEndpoints();
  const setKratosEndpoints = useSetKratosEndpoints();
  const resetSettings = useResetSettings();
  const isValidUrl = useIsValidUrl();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    defaultValues: {
      publicUrl: kratosEndpoints.publicUrl,
      adminUrl: kratosEndpoints.adminUrl,
    },
  });

  const watchedValues = watch();

  // Reset form when endpoints change or dialog opens
  useEffect(() => {
    reset({
      publicUrl: kratosEndpoints.publicUrl,
      adminUrl: kratosEndpoints.adminUrl,
    });
  }, [kratosEndpoints, reset, open]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      setKratosEndpoints({
        publicUrl: data.publicUrl.trim(),
        adminUrl: data.adminUrl.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = async () => {
    await resetSettings();
    // The form will automatically update when kratosEndpoints change due to the useEffect
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validateUrl = (value: string) => {
    if (!value.trim()) return 'URL is required';
    if (!isValidUrl(value.trim())) return 'Please enter a valid URL';
    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { minHeight: '400px' },
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            <Typography variant="h6">Kratos Settings</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Configure your Ory Kratos endpoint URLs
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> These are the real Kratos endpoint URLs that the application will proxy to. Settings are stored in your
            browser&apos;s local storage and take effect immediately.
          </Typography>
        </Alert>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Endpoint Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="publicUrl"
                control={control}
                rules={{
                  validate: validateUrl,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kratos Public URL"
                    placeholder="http://localhost:4433"
                    fullWidth
                    error={!!errors.publicUrl}
                    helperText={errors.publicUrl?.message || 'Used for public API calls (registration, login, etc.)'}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="adminUrl"
                control={control}
                rules={{
                  validate: validateUrl,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kratos Admin URL"
                    placeholder="http://localhost:4434"
                    fullWidth
                    error={!!errors.adminUrl}
                    helperText={errors.adminUrl?.message || 'Used for admin API calls (identity management, etc.)'}
                  />
                )}
              />
            </Grid>

            {/* Current Values Preview */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Current Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Public URL:</strong> {kratosEndpoints.publicUrl}
                </Typography>
                <Typography variant="body2">
                  <strong>Admin URL:</strong> {kratosEndpoints.adminUrl}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button onClick={handleReset} startIcon={<ResetIcon />} color="secondary" variant="outlined">
          Reset to Defaults
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={!isDirty}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
