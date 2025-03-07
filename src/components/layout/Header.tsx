import { useState } from 'react';
import { 
  AppBar, 
  Avatar, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Toolbar, 
  Tooltip, 
  Typography 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useUser, useLogout } from '@/lib/stores/authStore';
import Link from 'next/link';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const user = useUser();
  const logout = useLogout();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        boxShadow: 'none',
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid #e6e8f0',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onSidebarToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Ory Kratos Admin
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="large">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Account">
            <IconButton
              onClick={handleOpenUserMenu}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar 
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              >
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu} component={Link} href="/profile">
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu} component={Link} href="/settings">
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography textAlign="center">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
