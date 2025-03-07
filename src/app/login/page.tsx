'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings, RemoveRedEye } from '@mui/icons-material';
import { useLogin } from '@/lib/stores/authStore';
import { USERS, UserRole } from '@/lib/config/users';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const setDemoCredentials = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Kratos Admin UI
          </Typography>
          
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            
            <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
              <InputLabel htmlFor="password">Password *</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
              />
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Available Demo Accounts
              </Typography>
            </Divider>
            
            <Grid container spacing={2}>
              {USERS.map((user) => (
                <Grid item xs={12} sm={6} key={user.username}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => setDemoCredentials(user.username, user.password)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {user.role === UserRole.ADMIN ? (
                          <AdminPanelSettings color="primary" sx={{ mr: 1 }} />
                        ) : (
                          <RemoveRedEye color="secondary" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {user.displayName}
                        </Typography>
                      </Box>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        color={user.role === UserRole.ADMIN ? "primary" : "secondary"}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Username: <strong>{user.username}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Password: <strong>{user.password}</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
