import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  CalendarToday,
  Description,
  VideoCall,
  MedicalServices,
  Favorite,
  Speed,
  Thermostat,
  Add
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';

const PatientDashboard = () => {
  const menuItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: <Speed /> },
    { path: '/patient/appointments', label: 'My Appointments', icon: <CalendarToday /> },
    { path: '/patient/doctors', label: 'Find Doctors', icon: <VideoCall /> },
    { path: '/patient/records', label: 'Health Records', icon: <Description /> },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: <MedicalServices /> },
  ];

  const stats = [
    { label: 'Upcoming Appointments', value: '3', icon: <CalendarToday />, color: '#1E88E5' },
    { label: 'Health Records', value: '12', icon: <Description />, color: '#8E24AA' },
    { label: 'Consultations', value: '8', icon: <VideoCall />, color: '#43A047' },
    { label: 'Prescriptions', value: '5', icon: <MedicalServices />, color: '#FB8C00' },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'General Physician', date: 'Today', time: '3:00 PM', type: 'Video Call' },
    { id: 2, doctor: 'Dr. John Doe', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM', type: 'In-Person' },
  ];

  const recentPrescriptions = [
    { id: 1, medicine: 'Paracetamol 500mg', doctor: 'Dr. Sarah Smith', date: '2 days ago', duration: '5 days' },
    { id: 2, medicine: 'Amoxicillin 250mg', doctor: 'Dr. John Doe', date: '1 week ago', duration: '7 days' },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', icon: <Favorite />, color: '#e91e63' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal', icon: <Speed />, color: '#2196f3' },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'Normal', icon: <Thermostat />, color: '#ff9800' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
            Patient Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's an overview of your health.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 3, px: 3, py: 1.2, textTransform: 'none', fontWeight: 'bold' }}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: stat.color + '15', color: stat.color, width: 50, height: 50 }}>
                  {stat.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Upcoming Appointments */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Upcoming Appointments
              </Typography>
              <List disablePadding>
                {upcomingAppointments.map((appt, idx) => (
                  <ListItem
                    key={appt.id}
                    sx={{
                      borderRadius: 3,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.light' }}>
                        {appt.doctor.split(' ')[1].charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{appt.doctor}</Typography>}
                      secondary={appt.specialty}
                      sx={{ flexGrow: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, my: { xs: 2, sm: 0 }, minWidth: { sm: 200 } }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{appt.date}</Typography>
                        <Typography variant="caption" color="textSecondary">{appt.time}</Typography>
                      </Box>
                      <Chip label={appt.type} size="small" variant="soft" color="primary" />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <Button variant="contained" size="small" disableElevation sx={{ borderRadius: 2 }}>Join</Button>
                      <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Edit</Button>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Recent Prescriptions */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Recent Prescriptions
              </Typography>
              <Grid container spacing={2}>
                {recentPrescriptions.map((px) => (
                  <Grid item xs={12} sm={6} key={px.id}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{px.medicine}</Typography>
                      <Typography variant="body2" color="textSecondary">Dr. {px.doctor}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ bgcolor: 'success.light', color: 'success.dark', px: 1, py: 0.5, borderRadius: 1 }}>
                          {px.date}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">Duration: {px.duration}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            {/* Health Metrics */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Health Metrics
              </Typography>
              <Stack spacing={3}>
                {healthMetrics.map((metric, idx) => (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: metric.color + '15', color: metric.color }}>
                          {React.cloneElement(metric.icon, { sx: { fontSize: 18 } })}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">{metric.label}</Typography>
                      </Box>
                      <Chip label={metric.status} size="small" color="success" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
                      <Typography variant="caption" color="textSecondary">{metric.unit}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Quick Tips */}
            <Card sx={{ borderRadius: 4, bgcolor: 'primary.dark', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Health Tip of the Day
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                  Drink at least 8 glasses of water today to stay hydrated and maintain your energy levels.
                </Typography>
                <Button variant="contained" color="secondary" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default PatientDashboard;
