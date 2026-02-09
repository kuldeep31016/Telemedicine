/**
 * Doctor Dashboard (Doctor Landing Page)
 * This is the main landing page that appears after doctor login/registration
 * Shows appointments, patients, stats, and calendar
 */

import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  LinearProgress
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
  PendingActions,
  PersonAdd,
  Group,
  CalendarMonth,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  FiberManualRecord
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';

const DoctorDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('November');
  
  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <DateRange /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <DateRange />, badge: '5' },
    { path: '/doctor/patients', label: 'My Patients', icon: <People /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <VideoCall /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <Assignment /> },
  ];

  const stats = [
    { 
      label: "Total Patients", 
      value: '1644', 
      change: '+10%',
      trending: 'up',
      icon: <People />, 
      color: '#4A90E2',
      bgColor: '#E3F2FD'
    },
    { 
      label: 'Old Patients', 
      value: '300', 
      change: '+24%',
      trending: 'up',
      icon: <Group />, 
      color: '#E91E63',
      bgColor: '#FCE4EC'
    },
    { 
      label: 'New Patients', 
      value: '100', 
      change: '+20%',
      trending: 'up',
      icon: <PersonAdd />, 
      color: '#4CAF50',
      bgColor: '#E8F5E9'
    },
    { 
      label: 'Appointments', 
      value: '355', 
      change: '+5%',
      trending: 'up',
      icon: <CalendarMonth />, 
      color: '#FF9800',
      bgColor: '#FFF3E0'
    },
  ];

  // Daily appointment data (bar chart simulation)
  const dailyStats = [
    { day: 'Sat', online: 35, offline: 25 },
    { day: 'Sun', online: 42, offline: 30 },
    { day: 'Mon', online: 48, offline: 35 },
    { day: 'Tue', online: 38, offline: 32 },
    { day: 'Wed', online: 45, offline: 30 },
    { day: 'Thu', online: 50, offline: 35 },
    { day: 'Fri', online: 40, offline: 28 },
  ];

  // Appointment stats (line chart simulation)
  const weeklyStats = [
    { day: 'Sat', value: 20 },
    { day: 'Sun', value: 45 },
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 55 },
    { day: 'Wed', value: 65 },
    { day: 'Thu', value: 50 },
    { day: 'Fri', value: 70 },
  ];

  // Patient overview (donut chart data)
  const patientOverview = [
    { label: 'Child', value: 5, color: '#FF6B9D', percentage: 7 },
    { label: 'Adult', value: 10, color: '#4ECDC4', percentage: 14 },
    { label: 'Older', value: 12, color: '#FFD93D', percentage: 17 },
    { label: 'Total', value: 70, color: '#4A90E2', percentage: 100 }
  ];

  // Upcoming appointments for calendar
  const upcomingAppointments = [
    { id: 1, patient: 'Cody Fisher', status: 'Offline', time: '8:30AM', avatar: 'CF' },
    { id: 2, patient: 'Marvin McKinney', status: 'Offline', time: '8:45AM', avatar: 'MM' },
    { id: 3, patient: 'Bessie Cooper', status: 'Online', time: '9:00AM', avatar: 'BC' },
    { id: 4, patient: 'Jane Cooper', status: 'Offline', time: '9:15AM', avatar: 'JC' },
    { id: 5, patient: 'Theresa Webb', status: 'Offline', time: '9:30AM', avatar: 'TW' },
    { id: 6, patient: 'Guy Hawkins', status: 'Online', time: '9:45AM', avatar: 'GH' },
  ];

  // Patients table data
  const patients = [
    { 
      name: 'Ethan', 
      age: '25 years', 
      date: '9 Nov 2025, 4:15PM', 
      condition: 'Partial Polyalgi', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Liam Carter', 
      age: '43 years', 
      date: '7 Nov 2025, 3:30PM', 
      condition: 'Stein therapy', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Ava Mitchell', 
      age: '20 years', 
      date: '6 Nov 2025, 3:45PM', 
      condition: 'Angioplasty', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Noah Patel', 
      age: '30 years', 
      date: '4 Nov 2025, 7:50PM', 
      condition: 'Mucus weakness', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Sophia Reyes', 
      age: '18 years', 
      date: '4 Nov 2025, 6:45PM', 
      condition: 'Decreased libido', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Harper Kim', 
      age: '26 years', 
      date: '2 Nov 2025, 1:15PM', 
      condition: 'Serotonin', 
      report: 'View',
      action: 'View'
    },
    { 
      name: 'Mason Lee', 
      age: '28 years', 
      date: '9 Nov 2025, 6:15PM', 
      condition: 'Anterolist', 
      report: 'View',
      action: 'View'
    },
  ];

  const maxDailyValue = Math.max(...dailyStats.map(d => d.online + d.offline));
  const maxWeeklyValue = Math.max(...weeklyStats.map(s => s.value));

  return (
    <DashboardLayout menuItems={menuItems}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e', mb: 1 }}>
          Welcome back
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
            Dr. Andrew 👋
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' },
                bgcolor: stat.bgColor,
                border: 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: stat.color }}>
                      {stat.trending === 'up' ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                      <Typography variant="caption" fontWeight="bold">{stat.change}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                  {stat.value}
                  {index === 3 && <Typography component="span" variant="h6" sx={{ color: 'text.secondary' }}>+</Typography>}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Appointment Stats */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Daily Appointment Stats
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {/* Bar Chart Simulation */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 200, mb: 2 }}>
              {dailyStats.map((stat, idx) => {
                const totalHeight = ((stat.online + stat.offline) / maxDailyValue) * 180;
                const onlineHeight = (stat.online / (stat.online + stat.offline)) * totalHeight;
                const offlineHeight = (stat.offline / (stat.online + stat.offline)) * totalHeight;
                const isHighlight = stat.day === 'Tue';
                
                return (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                      {/* Offline (darker) bar */}
                      <Box
                        sx={{
                          width: isHighlight ? 40 : 32,
                          height: offlineHeight,
                          bgcolor: isHighlight ? '#2C3E50' : '#4A5568',
                          borderRadius: '8px 8px 0 0',
                          transition: 'all 0.3s'
                        }}
                      />
                      {/* Online (lighter) bar */}
                      <Box
                        sx={{
                          width: isHighlight ? 40 : 32,
                          height: onlineHeight,
                          bgcolor: isHighlight ? '#48BB78' : '#68D391',
                          borderRadius: '0 0 8px 8px',
                          transition: 'all 0.3s'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight={isHighlight ? 'bold' : 'medium'} color="textSecondary">
                      {stat.day}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#48BB78', borderRadius: 1 }} />
                <Typography variant="caption" color="textSecondary">Online</Typography>
                <Typography variant="caption" fontWeight="bold">50 Visitors</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#2C3E50', borderRadius: 1 }} />
                <Typography variant="caption" color="textSecondary">Offline</Typography>
                <Typography variant="caption" fontWeight="bold">50 Visitors</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Appointment Stats */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Appointment Stats
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {/* Line Chart Simulation */}
            <Box sx={{ position: 'relative', height: 180, mb: 2 }}>
              <svg width="100%" height="180" style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 45}
                    x2="100%"
                    y2={i * 45}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Line path */}
                <path
                  d={weeklyStats.map((stat, idx) => {
                    const x = (idx / (weeklyStats.length - 1)) * 100;
                    const y = 180 - (stat.value / maxWeeklyValue) * 160;
                    return `${idx === 0 ? 'M' : 'L'} ${x}% ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#4A90E2"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Area fill */}
                <path
                  d={`${weeklyStats.map((stat, idx) => {
                    const x = (idx / (weeklyStats.length - 1)) * 100;
                    const y = 180 - (stat.value / maxWeeklyValue) * 160;
                    return `${idx === 0 ? 'M' : 'L'} ${x}% ${y}`;
                  }).join(' ')} L 100% 180 L 0 180 Z`}
                  fill="url(#gradient)"
                  opacity="0.2"
                />
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Points */}
                {weeklyStats.map((stat, idx) => {
                  const x = (idx / (weeklyStats.length - 1)) * 100;
                  const y = 180 - (stat.value / maxWeeklyValue) * 160;
                  return (
                    <circle
                      key={idx}
                      cx={`${x}%`}
                      cy={y}
                      r="5"
                      fill="white"
                      stroke="#4A90E2"
                      strokeWidth="3"
                    />
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {weeklyStats.map((stat, idx) => (
                  <Typography key={idx} variant="caption" color="textSecondary" fontSize="10px">
                    {stat.day}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecord sx={{ fontSize: 12, color: '#4A90E2' }} />
                <Typography variant="caption" color="textSecondary">Visitors</Typography>
              </Box>
              <Typography variant="caption" fontWeight="bold">50 Visitors</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Patient Overview */}
        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Patient Overview
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {/* Donut Chart Simulation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
              <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#4A90E2"
                    strokeWidth="30"
                    strokeDasharray="220 314"
                    transform="rotate(-90 70 70)"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#FFD93D"
                    strokeWidth="30"
                    strokeDasharray="53 314"
                    strokeDashoffset="-220"
                    transform="rotate(-90 70 70)"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#4ECDC4"
                    strokeWidth="30"
                    strokeDasharray="44 314"
                    strokeDashoffset="-273"
                    transform="rotate(-90 70 70)"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#FF6B9D"
                    strokeWidth="30"
                    strokeDasharray="22 314"
                    strokeDashoffset="-317"
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">70</Typography>
                  <Typography variant="caption" color="textSecondary">Total</Typography>
                </Box>
              </Box>
            </Box>

            {/* Legend */}
            <Stack spacing={1.5}>
              {patientOverview.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="body2" color="textSecondary">{item.label}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Appointments
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {/* Calendar Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <IconButton size="small">&lt;</IconButton>
              <Chip label={selectedMonth} sx={{ fontWeight: 'bold' }} />
              <IconButton size="small">&gt;</IconButton>
            </Box>

            {/* Calendar Days */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
              {['Sat', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <Typography key={day} variant="caption" textAlign="center" color="textSecondary" fontSize="10px">
                  {day}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 3 }}>
              {['-', '-', '-', '3', '4', '5', '6', '7', '8', '9'].map((day, idx) => (
                <Box
                  key={idx}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: day === '4' ? '50%' : 0,
                    bgcolor: day === '4' ? '#4A90E2' : 'transparent',
                    color: day === '4' ? 'white' : 'text.primary',
                    fontWeight: day === '4' ? 'bold' : 'normal',
                    fontSize: '12px'
                  }}
                >
                  {day !== '-' && day}
                </Box>
              ))}
            </Box>

            {/* Appointment List */}
            <List disablePadding sx={{ maxHeight: 240, overflow: 'auto' }}>
              {upcomingAppointments.map((appt, idx) => (
                <ListItem
                  key={appt.id}
                  sx={{
                    px: 0,
                    py: 1,
                    borderBottom: idx < upcomingAppointments.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '12px',
                        bgcolor: appt.status === 'Online' ? '#4CAF50' : '#9E9E9E'
                      }}
                    >
                      {appt.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="600">
                        {appt.patient}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {appt.time}
                      </Typography>
                    }
                  />
                  <Chip
                    label={appt.status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: appt.status === 'Online' ? '#4CAF50' : '#757575',
                      bgcolor: appt.status === 'Online' ? '#E8F5E9' : '#F5F5F5'
                    }}
                  />
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Patients Table */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Patients
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Daily" size="small" />
                <Chip label="Weekly" size="small" variant="outlined" />
                <Chip label="Monthly" size="small" variant="outlined" />
                <Chip label="Yearly" size="small" variant="outlined" />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>AGE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>DATE & TIME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>APPOINTED FOR</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>REPORT</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.secondary' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '12px' }}>
                            {patient.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="600">
                            {patient.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{patient.age}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {patient.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{patient.condition}</Typography>
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<AccessTime />} sx={{ textTransform: 'none', fontSize: '12px' }}>
                          {patient.report}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<CheckCircle />} sx={{ textTransform: 'none', fontSize: '12px' }}>
                          {patient.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
