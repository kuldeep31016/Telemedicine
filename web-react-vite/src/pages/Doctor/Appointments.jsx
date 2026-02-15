/**
 * Doctor Appointments Page
 * Shows all appointments with filters, status tabs, and appointment details
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  VideoCall,
  Assignment,
  CalendarMonth,
  AttachMoney,
  Schedule,
  VerifiedUser,
  Visibility,
  Phone,
  Email,
  AccessTime,
  Person,
  LocalHospital,
  Refresh,
  CheckCircle
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { doctorAPI } from '../../api/doctor.api';

const DoctorAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [stats, setStats] = useState(null);

  // Filter states
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'tomorrow'
  const [statusFilter, setStatusFilter] = useState('all');
  const [mainTab, setMainTab] = useState(0); // 0: Pending, 1: Completed
  const [subTab, setSubTab] = useState(0); // 0: All, 1: Pending

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Sidebar menu items
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
    fetchAppointments();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, dateFilter, statusFilter, mainTab, subTab]);

  const fetchStats = async () => {
    try {
      const response = await doctorAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments from API...');
      const response = await doctorAPI.getMyAppointments({ limit: 100 });
      console.log('API Response:', response);
      if (response.success) {
        const appointmentsList = response.data.appointments || [];
        console.log('Appointments received:', appointmentsList.length);
        setAppointments(appointmentsList);
      } else {
        console.error('API returned success: false');
        setAppointments([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log('Applying filters to', appointments.length, 'appointments');
    let filtered = [...appointments];

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateFilter === 'today') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });
      console.log('After today filter:', filtered.length);
    } else if (dateFilter === 'tomorrow') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === tomorrow.getTime();
      });
      console.log('After tomorrow filter:', filtered.length);
    }

    // Main tab filter (Pending/Completed)
    if (mainTab === 0) {
      // Pending tab - show all except completed and cancelled
      filtered = filtered.filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled');
      console.log('After pending tab filter:', filtered.length);
    } else {
      // Completed tab
      filtered = filtered.filter(apt => apt.status === 'completed');
      console.log('After completed tab filter:', filtered.length);
    }

    // Sub tab filter (only apply if on Pending main tab)
    if (mainTab === 0 && subTab === 1) {
      // Only pending status
      filtered = filtered.filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
      console.log('After sub-tab pending filter:', filtered.length);
    }

    // Status dropdown filter (overrides other filters if not 'all')
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
      console.log('After status filter:', filtered.length);
    }

    console.log('Final filtered appointments:', filtered.length);
    setFilteredAppointments(filtered);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getModeChip = (mode) => {
    return (
      <Chip
        label={mode === 'video' ? 'Online' : 'Offline'}
        size="small"
        sx={{
          bgcolor: 'transparent',
          border: '1px solid #e0e0e0',
          color: 'text.primary'
        }}
      />
    );
  };

  // Pagination
  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <DashboardLayout menuItems={menuItems}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
            Appointments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label={`Total: ${appointments.length}`} 
              color="primary" 
              sx={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
            {/* <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={fetchAppointments}
              disabled={loading}
            >
              Refresh
            </Button> */}
          </Box>
        </Box>

        {/* Filters Section */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant={dateFilter === 'today' ? 'contained' : 'outlined'}
            onClick={() => setDateFilter('today')}
            sx={{ textTransform: 'none' }}
          >
            Today
          </Button>
          <Button
            variant={dateFilter === 'tomorrow' ? 'contained' : 'outlined'}
            onClick={() => setDateFilter('tomorrow')}
            sx={{ textTransform: 'none' }}
          >
            Tomorrow
          </Button>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">Status: All</MenuItem>
              <MenuItem value="pending">Status: Pending</MenuItem>
              <MenuItem value="confirmed">Status: Confirmed</MenuItem>
              <MenuItem value="completed">Status: Completed</MenuItem>
              <MenuItem value="cancelled">Status: Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{ textTransform: 'none', ml: 'auto' }}
          >
            Show Filters
          </Button>
        </Box>

        {/* Main Tabs */}
        <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}>
            <Tab label="Pending" />
            <Tab label="Completed" />
          </Tabs>
        </Box>

        {/* Sub Tabs */}
        <Box sx={{ mt: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={subTab} onChange={(e, v) => setSubTab(v)}>
            <Tab label="All" />
            <Tab label="Pending" />
          </Tabs>
        </Box>
      </Box>

      {/* Appointments Table */}
      <Paper sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading appointments...</Typography>
          </Box>
        ) : appointments.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Alert severity="warning">
              No appointments found. This could mean you don't have any appointments yet or there was an error fetching them.
            </Alert>
          </Box>
        ) : filteredAppointments.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Alert severity="info">
              <Typography variant="body1" sx={{ mb: 1 }}>
                No appointments match the current filters
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total appointments: {appointments.length} | Try changing the filters or tabs
              </Typography>
            </Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      S. No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Patient
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Contact
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Problem
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Mode
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
                      
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appointment, index) => (
                    <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                      <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {appointment.appointmentTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {appointment.patientId?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.patientId?.age || '0'}, {appointment.patientId?.gender || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {appointment.patientId?.phone || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            ◆ {new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {appointment.notes || 'General Consultation'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Appointment #{appointment._id?.slice(-6) || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getModeChip(appointment.consultationType)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(appointment)}
                          sx={{ textTransform: 'none' }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {Math.min((page - 1) * rowsPerPage + 1, filteredAppointments.length)} of {filteredAppointments.length} results
              </Typography>
              <Pagination
                count={Math.ceil(filteredAppointments.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>

      {/* Appointment Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Appointment Details
            </Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <Box sx={{ fontSize: 24 }}>✕</Box>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          {selectedAppointment && (
            <Box>
              {/* Patient Information Section */}
              <Box sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Person sx={{ fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Patient Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={2}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#4A90E2',
                        fontSize: 32,
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedAppointment.patientId?.name?.charAt(0) || 'P'}
                    </Avatar>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Patient Name
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {selectedAppointment.patientId?.name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Age & Gender
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedAppointment.patientId?.age || 'N/A'} years, {selectedAppointment.patientId?.gender || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Contact
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body1" fontWeight="500">
                          +91 {selectedAppointment.patientId?.phone || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Appointment Information Section */}
              <Box sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CalendarMonth sx={{ fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Appointment Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#E3F2FD', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CalendarMonth sx={{ fontSize: 20, color: '#1976d2' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Appointment Date
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#FFF3E0', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AccessTime sx={{ fontSize: 20, color: '#f57c00' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Appointment Time
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {selectedAppointment.appointmentTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#F3E5F5', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <VideoCall sx={{ fontSize: 20, color: '#7b1fa2' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Consultation Type
                        </Typography>
                        <Chip
                          label={selectedAppointment.consultationType === 'video' ? 'Online Consultation' : 'Offline Consultation'}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            bgcolor: '#f5f5f5',
                            color: 'text.primary'
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#FFF3E0', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#f57c00' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Status
                        </Typography>
                        <Chip
                          label={selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                          color={getStatusColor(selectedAppointment.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Information Section */}
              <Box sx={{ mb: 2, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AttachMoney sx={{ fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Payment Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#E8F5E9', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ fontSize: 20, color: '#2e7d32', fontWeight: 'bold' }}>₹</Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Amount Paid
                        </Typography>
                        <Typography variant="h5" fontWeight="700" color="#2e7d32">
                          ₹{selectedAppointment.amount || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#E8F5E9', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Payment Status
                        </Typography>
                        <Chip
                          label={selectedAppointment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          color={selectedAppointment.paymentStatus === 'paid' ? 'success' : 'warning'}
                          size="small"
                          icon={<CheckCircle sx={{ fontSize: 16 }} />}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#E3F2FD', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 36
                      }}>
                        <Box sx={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold' }}>S</Box>
                      </Box>
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Payment ID:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            fontSize: '0.85rem'
                          }}
                        >
                          {selectedAppointment.paymentId || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: '#F3E5F5', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 36
                      }}>
                        <Box sx={{ fontSize: 16, color: '#7b1fa2', fontWeight: 'bold' }}>#</Box>
                      </Box>
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Order ID:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            fontSize: '0.85rem'
                          }}
                        >
                          {selectedAppointment.orderId || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button 
            onClick={handleCloseDetails}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
