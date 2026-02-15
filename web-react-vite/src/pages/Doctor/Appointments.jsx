/**
 * Doctor Appointments Page
 * Shows all appointments with filters, status tabs, and appointment details
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone as PhoneIcon,
  MapPin, 
  User,
  Eye,
  Loader2
} from 'lucide-react';
import {
  Box,
  Typography,
  Paper,
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
  const navigate = useNavigate();
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
  const [countdown, setCountdown] = useState(0); // Force re-render for countdown

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

  // Update countdown every second for appointments
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

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

  const getTimeRemaining = (appointmentDate, appointmentTime) => {
    const aptDate = new Date(appointmentDate);
    const timeMatch = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const meridiem = timeMatch[3].toUpperCase();
      
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      
      aptDate.setHours(hours, minutes, 0, 0);
    }
    
    const now = new Date();
    const timeDiff = aptDate - now;
    const totalMinutes = Math.floor(timeDiff / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    
    if (days > 1) return `In ${days} days`;
    if (days === 1) return 'Tomorrow';
    if (totalHours > 0) return `In ${totalHours}h ${totalMinutes % 60}m`;
    if (totalMinutes > 0) return `In ${totalMinutes}m`;
    return 'Now';
  };

  const getJoinStatus = (appointment) => {
    // Check if paid
    if (appointment.paymentStatus !== 'paid') {
      return { canJoin: false, message: 'Payment pending' };
    }
    
    // Check if confirmed
    if (!['confirmed', 'completed'].includes(appointment.status)) {
      return { canJoin: false, message: 'Not confirmed' };
    }
    
    // Check if video consultation
    if (appointment.consultationType !== 'video') {
      return { canJoin: false, message: 'In-person only' };
    }
    
    // Check timing (allow joining 15 minutes before)
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const timeStr = appointment.appointmentTime;
    
    // Parse time (handles formats like "09:00 AM", "03:00 PM")
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const meridiem = timeMatch[3].toUpperCase();
      
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      
      appointmentDateTime.setHours(hours, minutes, 0, 0);
    }
    
    const now = new Date();
    const consultationDuration = appointment.consultationDuration || 15;
    const endTime = new Date(appointmentDateTime.getTime() + consultationDuration * 60 * 1000);
    const fifteenMinsBefore = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);
    const timeDiff = appointmentDateTime - now;
    const totalMinutes = Math.floor(timeDiff / 60000);
    
    // Debug logging
    console.log('Doctor Join Status Check:', {
      appointmentId: appointment._id,
      appointmentTime: timeStr,
      aptDate: appointmentDateTime.toLocaleString(),
      now: now.toLocaleString(),
      fifteenMinsBefore: fifteenMinsBefore.toLocaleString(),
      endTime: endTime.toLocaleString(),
      totalMinutes,
      canJoinWindow: now >= fifteenMinsBefore && now <= endTime
    });
    
    // Allow joining 15 minutes before and until end time
    const canJoinByTime = now >= fifteenMinsBefore && now <= endTime;
    
    if (canJoinByTime) {
      // Show live countdown when less than 15 min
      if (totalMinutes <= 15 && totalMinutes > 0) {
        const mins = Math.floor(totalMinutes);
        const secs = Math.floor((timeDiff % 60000) / 1000);
        return { canJoin: true, message: `Starting in ${mins}:${secs.toString().padStart(2, '0')}`, isCountdown: true };
      } else if (totalMinutes <= 0) {
        return { canJoin: true, message: 'Start Now', isCountdown: false };
      } else {
        return { canJoin: true, message: 'Start Consultation', isCountdown: false };
      }
    } else if (timeDiff > 0) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const days = Math.floor(hours / 24);
      
      if (days > 1) {
        return { canJoin: false, message: `In ${days} days`, isCountdown: false };
      } else if (days === 1) {
        return { canJoin: false, message: 'Tomorrow', isCountdown: false };
      } else if (hours > 0) {
        return { canJoin: false, message: `In ${hours}h ${mins}m`, isCountdown: false };
      } else {
        return { canJoin: false, message: `In ${mins}m`, isCountdown: false };
      }
    } else {
      return { canJoin: false, message: 'Time passed', isCountdown: false };
    }
  };

  const handleJoinConsultation = (appointmentId) => {
    navigate(`/doctor/consultation/${appointmentId}`);
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

      {/* Appointments Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <Alert severity="warning">
              No appointments found. This could mean you don't have any appointments yet or there was an error fetching them.
            </Alert>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <Alert severity="info">
              <Typography variant="body1" sx={{ mb: 1 }}>
                No appointments match the current filters
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total appointments: {appointments.length} | Try changing the filters or tabs
              </Typography>
            </Alert>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {paginatedAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Patient Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center border-2 border-slate-100">
                      <User className="w-10 h-10 text-white" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-slate-900">
                              {appointment.patientId?.name || 'N/A'}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                              #{appointment._id?.slice(-6) || 'N/A'}
                            </span>
                          </div>
                          <p className="text-blue-600 font-semibold text-sm mb-1">
                            {appointment.patientId?.age || '0'} years, {appointment.patientId?.gender || 'N/A'}
                          </p>
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <PhoneIcon className="w-4 h-4" />
                            <span>{appointment.patientId?.phone || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                            appointment.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-200' :
                            appointment.status === 'completed' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            appointment.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                            'bg-yellow-50 text-yellow-600 border border-yellow-200'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          {appointment.status === 'confirmed' && (() => {
                            const timeRemaining = getTimeRemaining(appointment.appointmentDate, appointment.appointmentTime);
                            return (
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                ⏰ {timeRemaining}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Date</p>
                            <p className="text-sm font-bold text-slate-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Time</p>
                            <p className="text-sm font-bold text-slate-900">{appointment.appointmentTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                            <Video className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Type</p>
                            <p className="text-sm font-bold text-slate-900 capitalize">{appointment.consultationType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Problem/Notes Section */}
                      <div className="bg-slate-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-slate-500 font-medium mb-1">Chief Complaint</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {appointment.notes || 'General Consultation'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            Duration: {appointment.consultationDuration || 15} mins
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {appointment.consultationType === 'video' && (() => {
                            const joinStatus = getJoinStatus(appointment);
                            return (
                              <button 
                                onClick={() => joinStatus.canJoin && handleJoinConsultation(appointment._id)}
                                disabled={!joinStatus.canJoin}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
                                  joinStatus.canJoin 
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100 cursor-pointer' 
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <Video className="w-4 h-4" />
                                {joinStatus.message}
                              </button>
                            );
                          })()}
                          <button 
                            onClick={() => handleViewDetails(appointment)}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Pagination */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', borderRadius: 4, border: '1px solid #e2e8f0' }}>
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
      </div>

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
