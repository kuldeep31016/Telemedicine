/**
 * Admin Dashboard (Admin Landing Page)
 * This is the main landing page that appears after admin login/registration
 * Shows admin overview, stats, users, and SOS alerts
 */

import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import {
  People,
  LocalHospital,
  CalendarToday,
  ErrorOutline,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  MoreVert,
  Assessment
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminDashboard = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <Assessment /> },
    { path: '/admin/users', label: 'Users', icon: <People /> },
    { path: '/admin/doctors', label: 'Doctors', icon: <LocalHospital /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <CalendarToday /> },
    { path: '/admin/sos-alerts', label: 'SOS Alerts', icon: <ErrorOutline />, badge: '3' },
  ];

  const stats = [
    { 
      label: 'Total Patients', 
      value: '1,234', 
      change: '+12%', 
      icon: <People />, 
      color: '#1E88E5', 
      trend: 'up',
      description: 'Registered patients'
    },
    { 
      label: 'Total Doctors', 
      value: '89', 
      change: '+5%', 
      icon: <LocalHospital />, 
      color: '#8E24AA', 
      trend: 'up',
      description: 'Active doctors'
    },
    { 
      label: 'Appointments Today', 
      value: '156', 
      change: '+8%', 
      icon: <CalendarToday />, 
      color: '#43A047', 
      trend: 'up',
      description: 'Scheduled today'
    },
    { 
      label: 'SOS Alerts', 
      value: '3', 
      change: '-2%', 
      icon: <ErrorOutline />, 
      color: '#E53935', 
      trend: 'down',
      description: 'Active emergencies'
    },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'patient', status: 'active', joined: '2 hours ago' },
    { id: 2, name: 'Dr. Sarah Smith', email: 'sarah@example.com', role: 'doctor', status: 'active', joined: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'patient', status: 'active', joined: '1 day ago' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
          Admin Overview
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome back, Administrator! Monitoring the platform's health.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                position: 'relative', 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                }
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: stat.color }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.color + '15', 
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: stat.trend === 'up' ? 'success.main' : 'error.main' }}>
                    {stat.trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                    <Typography variant="caption" fontWeight="bold" ml={0.5}>{stat.change}</Typography>
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5, color: '#1a237e' }}>{stat.label}</Typography>
                <Typography variant="caption" color="textSecondary">{stat.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Recent Registrations</Typography>
              <Button size="small">View All</Button>
            </Box>
            <List disablePadding>
              {recentUsers.map((user, idx) => (
                <React.Fragment key={user.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)' }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{user.name}</Typography>}
                      secondary={user.email}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'doctor' ? 'info' : 'success'}
                        sx={{ height: 20, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 'bold' }}
                      />
                      <Typography variant="caption" display="block" color="textSecondary" mt={0.5}>
                        {user.joined}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < recentUsers.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* SOS Alerts */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="error.main">Active SOS Alerts</Typography>
              <Chip label="3 Active" color="error" size="small" />
            </Box>
            <Stack spacing={2}>
              {[1, 2, 3].map((alert) => (
                <Box
                  key={alert}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'error.light',
                    bgcolor: 'error.main' + '05',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Emergency Alert #{alert}</Typography>
                    <Typography variant="caption" color="textSecondary" display="block">Patient: emergency_user_{alert}</Typography>
                    <Typography variant="caption" color="textSecondary">Location: Bhatinda, Punjab</Typography>
                  </Box>
                  <Button variant="outlined" color="error" size="small" sx={{ borderRadius: 2 }}>Resolve</Button>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AdminDashboard;
