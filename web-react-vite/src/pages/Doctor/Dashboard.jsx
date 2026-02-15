/**
 * Doctor Dashboard (Doctor Landing Page)
 * This is the main landing page that appears after doctor login/registration
 * Shows appointments, patients, stats, and comprehensive dashboard sections
 */

import React, { useState, useEffect } from 'react';
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  VideoCall,
  Assignment,
  ChevronRight,
  AccessTime,
  PendingActions,
  CalendarMonth,
  CalendarToday,
  AttachMoney,
  Schedule,
  VerifiedUser
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { doctorAPI } from '../../api/doctor.api';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);

  // Menu items for sidebar
  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <CalendarMonth />, badge: stats?.todayAppointments || 0 },
    { path: '/doctor/patients', label: 'My Patients', icon: <People /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <VideoCall /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <Assignment /> },
    { path: '/doctor/earnings', label: 'Earnings', icon: <AttachMoney /> },
    { path: '/doctor/schedule', label: 'Schedule', icon: <Schedule /> },
    { path: '/doctor/profile', label: 'Profile', icon: <VerifiedUser /> },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [statsResponse, appointmentsResponse, profileResponse] = await Promise.all([
        doctorAPI.getDashboardStats(),
        doctorAPI.getMyAppointments({ limit: 20 }),
        doctorAPI.getMyProfile()
      ]);

      console.log('Stats:', statsResponse);
      console.log('Appointments:', appointmentsResponse);
      console.log('Profile:', profileResponse);

      // Set stats
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Set appointments
      if (appointmentsResponse.success) {
        const appointments = appointmentsResponse.data.appointments || [];
        
        // Filter today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppts = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && aptDate < tomorrow;
        });
        
        // Filter upcoming appointments (next 7 days)
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingAppts = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= tomorrow && aptDate <= nextWeek;
        });
        
        setTodayAppointments(todayAppts);
        setUpcomingAppointments(upcomingAppts);
      }

      // Set profile
      if (profileResponse.success) {
        setDoctorProfile(profileResponse.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error && !stats) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e', mb: 1 }}>
          Welcome back
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
             {doctorProfile?.name || 'Doctor'} 👋
          </Typography>
        </Box>
      </Box>

      {/* Top Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', bgcolor: '#E3F2FD' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A90E2' }}>
                  <People />
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'center' }}>
                Total Patients
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#4A90E2', textAlign: 'center' }}>
                {stats?.totalPatients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', bgcolor: '#FFF3E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9800' }}>
                  <CalendarToday />
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'center' }}>
                Today's Appointments
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF9800', textAlign: 'center' }}>
                {stats?.todayAppointments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', bgcolor: '#FFE0B2' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6F00' }}>
                  <PendingActions />
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'center' }}>
                Pending Appointments
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF6F00', textAlign: 'center' }}>
                {stats?.pendingAppointments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', bgcolor: '#E1BEE7' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9C27B0' }}>
                  <AttachMoney />
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'center' }}>
                Monthly Earnings
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#9C27B0', textAlign: 'center' }}>
                ₹{stats?.monthlyEarnings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

       

        
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Schedule */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                📅 Today's Schedule
              </Typography>
              <Button variant="text" size="small" sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                View All
              </Button>
            </Box>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              No appointments scheduled for today
            </Typography>

            {todayAppointments.length === 0 ? (
              <Alert severity="info" icon={false} sx={{ bgcolor: '#E3F2FD', color: '#1976d2' }}>
                No appointments scheduled for today
              </Alert>
            ) : (
              <List disablePadding>
                {todayAppointments.map((appointment, idx) => (
                  <ListItem
                    key={appointment._id}
                    sx={{
                      px: 0,
                      py: 2,
                      borderBottom: idx < todayAppointments.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: appointment.consultationType === 'video' ? '#4CAF50' : '#9E9E9E'
                        }}
                      >
                        {appointment.patientId?.name?.charAt(0) || 'P'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            {appointment.patientId?.name || 'Patient'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.patientId?.age ? `${appointment.patientId.age} years` : ''} {appointment.patientId?.gender || ''}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={appointment.appointmentTime}
                            size="small"
                            icon={<AccessTime />}
                            sx={{ mr: 1, mb: 1 }}
                          />
                          <Chip
                            label={appointment.consultationType === 'video' ? 'Online' : 'Offline'}
                            size="small"
                            color={appointment.consultationType === 'video' ? 'success' : 'default'}
                            sx={{ mr: 1, mb: 1 }}
                          />
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={appointment.status === 'confirmed' ? 'primary' : 'default'}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {appointment.consultationType === 'video' && (
                        <Button size="small" variant="contained" color="success" startIcon={<VideoCall />}>
                          Start Call
                        </Button>
                      )}
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Appointments
              </Typography>
              <Button variant="text" size="small" sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                View All
              </Button>
            </Box>

            {upcomingAppointments.length === 0 ? (
              <Alert severity="info">No upcoming appointments in the next 7 days</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Patient</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingAppointments.map((appointment) => (
                      <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.appointmentTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {appointment.patientId?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.patientId?.age ? `${appointment.patientId.age}am` : '0.5am'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.consultationType === 'video' ? 'Online' : 'Offline'}
                            size="small"
                            sx={{ 
                              bgcolor: appointment.consultationType === 'video' ? 'transparent' : 'transparent',
                              color: 'text.primary',
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <ChevronRight />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
