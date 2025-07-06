'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  Divider,
  Button,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  Palette as PaletteIcon,
  Cloud as CloudIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useKratosEndpoints, useSetKratosEndpoints, useResetSettings, useIsValidUrl } from '@/features/settings/hooks/useSettings';
import { useTheme } from '@/providers/ThemeProvider';

const DRAWER_WIDTH = 280;

type SettingsSection = 'general' | 'kratos';

interface KratosSettingsForm {
  publicUrl: string;
  adminUrl: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { theme: currentTheme, toggleTheme } = useTheme();
  
  // Kratos settings
  const kratosEndpoints = useKratosEndpoints();
  const setKratosEndpoints = useSetKratosEndpoints();
  const resetSettings = useResetSettings();
  const isValidUrl = useIsValidUrl();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<KratosSettingsForm>({
    defaultValues: {
      publicUrl: kratosEndpoints.publicUrl,
      adminUrl: kratosEndpoints.adminUrl,
    },
  });

  useEffect(() => {
    reset({
      publicUrl: kratosEndpoints.publicUrl,
      adminUrl: kratosEndpoints.adminUrl,
    });
  }, [kratosEndpoints, reset]);

  const handleKratosSave = async (data: KratosSettingsForm) => {
    try {
      setKratosEndpoints({
        publicUrl: data.publicUrl.trim(),
        adminUrl: data.adminUrl.trim(),
      });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleKratosReset = async () => {
    await resetSettings();
    setShowSuccessMessage(true);
  };

  const validateUrl = (value: string) => {
    if (!value.trim()) return 'URL is required';
    if (!isValidUrl(value.trim())) return 'Please enter a valid URL';
    return true;
  };

  const handleThemeChange = () => {
    toggleTheme();
    setShowSuccessMessage(true);
  };

  const settingsMenuItems = [
    {
      id: 'general' as SettingsSection,
      label: 'General',
      icon: <PaletteIcon />,
      description: 'Theme and UI preferences',
    },
    {
      id: 'kratos' as SettingsSection,
      label: 'Kratos',
      icon: <CloudIcon />,
      description: 'Ory Kratos configuration',
    },
  ];

  const renderGeneralSettings = () => (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Appearance
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Theme Preference
        </FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">Light</Typography>
          <Switch
            checked={currentTheme === 'dark'}
            onChange={handleThemeChange}
            color="primary"
          />
          <Typography variant="body2">Dark</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Choose between light and dark theme. Your preference will be saved automatically.
        </Typography>
      </FormControl>
    </Paper>
  );

  const renderKratosSettings = () => (
    <Paper sx={{ p: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> These are the real Kratos endpoint URLs that the application will proxy to. Settings are stored in your
          browser&apos;s local storage and take effect immediately.
        </Typography>
      </Alert>

      <Box component="form" onSubmit={handleSubmit(handleKratosSave)}>
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

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button onClick={handleKratosReset} startIcon={<ResetIcon />} color="secondary" variant="outlined">
            Reset to Defaults
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            disabled={!isDirty}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      {/* Settings Menu Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%',
            border: 'none',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Tooltip title="Go back">
              <IconButton size="small" onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <SettingsIcon />
            <Typography variant="h6">Settings</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Configure application preferences
          </Typography>
        </Box>
        
        <List sx={{ pt: 0 }}>
          {settingsMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                sx={{
                  py: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    sx: {
                      color: activeSection === item.id ? 'primary.contrastText' : 'text.secondary',
                      opacity: activeSection === item.id ? 0.8 : 1,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
        <Box sx={{ maxWidth: 800 }}>
          <Typography variant="h4" gutterBottom>
            {settingsMenuItems.find(item => item.id === activeSection)?.label}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {settingsMenuItems.find(item => item.id === activeSection)?.description}
          </Typography>

          {activeSection === 'general' && renderGeneralSettings()}
          {activeSection === 'kratos' && renderKratosSettings()}
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}