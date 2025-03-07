import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DashboardOutlined, 
  PeopleOutlined, 
  SettingsOutlined, 
  SecurityOutlined, 
  KeyOutlined,
  DescriptionOutlined,
  LogoutOutlined 
} from '@mui/icons-material';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { useLogout } from '@/lib/stores/authStore';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    title: 'Identities',
    path: '/identities',
    icon: <PeopleOutlined />,
  },
  {
    title: 'Sessions',
    path: '/sessions',
    icon: <SecurityOutlined />,
  },
  {
    title: 'Schemas',
    path: '/schemas',
    icon: <DescriptionOutlined />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsOutlined />,
  },
  {
    title: 'API Keys',
    path: '/api-keys',
    icon: <KeyOutlined />,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: '#f9fafc',
          borderRight: '1px solid #e6e8f0',
        },
      }}
    >
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', ml: 1 }}>
          Kratos Admin
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List>
          {mainNavItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive(item.path)}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          {secondaryNavItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive(item.path)}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mb: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                color: 'grey.700',
              }}
            >
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
