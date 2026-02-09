import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Badge as MuiBadge,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  Notifications as Bell,
  Logout as LogOut,
  LocalHospital,
  Dashboard,
  People,
  VideoCall,
  Assignment
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const drawerWidth = 280;

const DashboardLayout = ({ children, menuItems = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // const handleLogout = async () => {
  //   await logout();
  //   navigate('/');
  // };
  const handleLogout = async () => {
  try {
    await logout();
    navigate('/', { replace: true });
  } catch (error) {
    console.error('Logout error:', error);
    navigate('/', { replace: true });
  }
};

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      doctor: 'primary',
      patient: 'success',
      asha_worker: 'secondary',
    };
    return colors[role] || 'info';
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#121926' }}>
      <Box sx={{ p: 3, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: '#2563eb',
            width: 40,
            height: 40,
          }}
        >
          <LocalHospital sx={{ color: 'white' }} />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
          ProvoHeal
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.08) !important' : 'transparent',
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'medium',
                    fontSize: '0.9rem'
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      bgcolor: '#ef4444',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          fullWidth
          variant="text"
          startIcon={<LogOut />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            justifyContent: 'flex-start',
            px: 2,
            '&:hover': {
              color: '#ef4444',
              bgcolor: 'rgba(239, 68, 68, 0.1)'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { lg: `${open ? drawerWidth : 0}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user?.role?.toUpperCase()}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 35,
                height: 35,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                cursor: 'pointer'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { lg: open ? drawerWidth : 0 },
          flexShrink: { lg: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          flexBasis: 0,
          minWidth: 0,
          p: 0,
          mt: 8,
          minHeight: '100vh',
          overflow: 'hidden',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
