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
  Paper
} from '@mui/material';
import {
  DateRange,
  People,
  VideoCall,
  Assignment,
  ChevronRight,
  MoreVert,
  AccessTime,
  CheckCircle,
  PendingActions
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';

const DoctorDashboard = () => {
  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <DateRange /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <DateRange />, badge: '5' },
    { path: '/doctor/patients', label: 'My Patients', icon: <People /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <VideoCall /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <Assignment /> },
  ];

  const stats = [
    { label: "Today's Appointments", value: '8', icon: <DateRange />, color: '#1976d2' },
    { label: 'Total Patients', value: '234', icon: <People />, color: '#9c27b0' },
    { label: 'Consultations', value: '12', icon: <VideoCall />, color: '#2e7d32' },
    { label: 'Prescriptions', value: '45', icon: <Assignment />, color: '#ed6c02' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Video Call', status: 'upcoming' },
    { id: 2, patient: 'Jane Smith', time: '11:30 AM', type: 'In-Person', status: 'upcoming' },
    { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Video Call', status: 'upcoming' },
  ];

  const recentPatients = [
    { id: 1, name: 'Alice Brown', lastVisit: '2 days ago', condition: 'Fever', status: 'treated' },
    { id: 2, name: 'Bob Wilson', lastVisit: '1 week ago', condition: 'Headache', status: 'follow-up' },
    { id: 3, name: 'Carol Davis', lastVisit: '3 days ago', condition: 'Cough', status: 'treated' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
          Doctor Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your appointments and consultations
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color + '20',
                    color: stat.color,
                    width: 56,
                    height: 56,
                    borderRadius: 3
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Today's Appointments
              </Typography>
              <Chip
                label={`${upcomingAppointments.length} Scheduled`}
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            <List disablePadding>
              {upcomingAppointments.map((appt, idx) => (
                <React.Fragment key={appt.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3, #21CBF3)' }}>
                        {appt.patient.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{appt.patient}</Typography>}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <AccessTime sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{appt.time}</Typography>
                          </Box>
                          <Chip
                            label={appt.type}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ mt: 1, height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                    />
                    <Box sx={{ mt: { xs: 2, sm: 0 }, display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" disableElevation sx={{ borderRadius: 2 }}>
                        Start Call
                      </Button>
                      <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                        Details
                      </Button>
                    </Box>
                  </ListItem>
                  {idx < upcomingAppointments.length - 1 && <Divider component="li" sx={{ my: 1, opacity: 0 }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Patients */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Recent Patients
            </Typography>
            <List disablePadding>
              {recentPatients.map((patient, idx) => (
                <ListItem
                  key={patient.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'primary.light' }
                  }}
                  secondaryAction={
                    <IconButton edge="end">
                      <ChevronRight />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light' }}>{patient.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight="bold">{patient.name}</Typography>}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="textSecondary">{patient.condition}</Typography>
                        <Chip
                          label={patient.status}
                          size="small"
                          color={patient.status === 'treated' ? 'success' : 'warning'}
                          sx={{ height: 16, fontSize: '0.6rem' }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button fullWidth color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
              View All Records
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
