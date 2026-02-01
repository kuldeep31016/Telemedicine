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

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)'
          }}
        >
          <LocalHospital />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
            Nabha
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Telemedicine
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ px: 2, mb: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #2196f3 0%, #f50057 100%)'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user?.name}
            </Typography>
            <Chip
              label={user?.role?.replace('_', ' ')}
              size="small"
              color={getRoleColor(user?.role)}
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}
            />
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{ height: 20, minWidth: 20 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogOut />}
          onClick={handleLogout}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { lg: `${open ? drawerWidth : 0}px)` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <MuiBadge variant="dot" color="error">
                <Bell />
              </MuiBadge>
            </IconButton>
            <Avatar
              sx={{
                width: 35,
                height: 35,
                background: 'linear-gradient(135deg, #2196f3 0%, #f50057 100%)',
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
        sx={{ width: { lg: open ? drawerWidth : 0 }, flexShrink: { lg: 0 } }}
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
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
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
          p: 3,
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
