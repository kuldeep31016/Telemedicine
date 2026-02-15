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
  Divider,
  Paper,
  Stack,
  CircularProgress,
  InputBase,
  alpha
} from '@mui/material';
import {
  People,
  LocalHospital,
  CalendarToday,
  ErrorOutline,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Assessment,
  Search as SearchIcon,
  NotificationsNone,
  ChatBubbleOutline,
  FilterList,
  Assignment,
  AttachMoney
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/admin.api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, change, icon, trend, loading, color = '#7c3aed', isCurrency = false, sx = {} }) => (
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      border: '1px solid #f1f5f9',
      bgcolor: 'white',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        borderColor: alpha(color, 0.2)
      },
      ...sx
    }}
  >
    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 48,
            height: 48,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 16px -4px ${alpha(color, 0.2)}`
          }}
        >
          {React.cloneElement(icon, { fontSize: 'medium' })}
        </Box>
        <Typography
          variant="caption"
          fontWeight="700"
          sx={{
            color: trend === 'up' ? '#10b981' : '#ef4444',
            bgcolor: alpha(trend === 'up' ? '#10b981' : '#ef4444', 0.1),
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.75rem'
          }}
        >
          {change} {trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: '#64748b',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: '0.65rem',
          mb: 0.5
        }}
      >
        {label}
      </Typography>

      {loading ? (
        <CircularProgress size={24} thickness={4} sx={{ mt: 1, color: color }} />
      ) : (
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{
            color: '#0f172a',
            mt: 'auto',
            fontSize: { xs: '1.75rem', md: '2rem' },
            letterSpacing: '-0.02em'
          }}
        >
          {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: <Assessment /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <CalendarToday /> },
    { path: '/admin/doctors', label: 'Doctors', icon: <LocalHospital /> },
    { path: '/admin/patients', label: 'Patients', icon: <People /> },
    { path: '/admin/reports', label: 'Reports', icon: <Assessment /> },
    { path: '/admin/sos-alerts', label: 'Messages', icon: <ChatBubbleOutline />, badge: '5' },
    { path: '/admin/prescriptions', label: 'Prescriptions', icon: <Assignment /> },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes, recentRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllAppointments(),
        adminAPI.getRecentRegistrations()
      ]);
      
      // Get patient and doctor counts from stats API (accurate database counts)
      const totalPatients = statsRes?.data?.totalPatients || 0;
      const totalDoctors = statsRes?.data?.totalDoctors || 0;
      
      // Calculate appointment count and revenue from appointments API
      let totalAppointments = 0;
      let totalRevenue = 0;
      
      if (appointmentsRes.success && appointmentsRes.data) {
        const appointments = appointmentsRes.data;
        totalAppointments = appointments.length;
        
        // Calculate total revenue (sum of paid appointments)
        totalRevenue = appointments.reduce((sum, apt) => {
          if (apt.paymentStatus === 'paid' && apt.amount) {
            return sum + apt.amount;
          }
          return sum;
        }, 0);
      }
      
      setStats({
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalRevenue
      });
      
      setRecentRegistrations(recentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <Box sx={{ width: '100%', px: { xs: 1.5, sm: 2 }, py: 2, boxSizing: 'border-box' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track, manage and forecast your platform data with real-time insights.
          </Typography>
        </Box>

        {/* Top Stats - CSS Grid for full width */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 3,
            width: '100%'
          }}
        >
          <StatCard
            label="Total Patients"
            value={stats?.totalPatients || 0}
            change="+12%"
            trend="up"
            icon={<People />}
            color="#2563eb"
            loading={loading}
          />
          <StatCard
            label="Total Doctors"
            value={stats?.totalDoctors || 0}
            change="+5%"
            trend="up"
            icon={<LocalHospital />}
            color="#7c3aed"
            loading={loading}
          />
          <StatCard
            label="Total Appointments"
            value={stats?.totalAppointments || 0}
            change="+8%"
            trend="up"
            icon={<CalendarToday />}
            color="#0891b2"
            loading={loading}
          />
          <StatCard
            label="Total Revenue"
            value={stats?.totalRevenue || 0}
            change="+25%"
            trend="up"
            icon={<AttachMoney />}
            color="#059669"
            loading={loading}
            isCurrency={true}
          />
        </Box>

        {/* Main Content Area */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 2,
            width: '100%'
          }}
        >
          {/* Visitors Statistics */}
            {/* <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', width: 40, height: 40, borderRadius: 2 }}>
                      <People fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">Visitors Statistics</Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<TrendingUp />}
                    sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary', borderColor: '#e2e8f0' }}
                  >
                    Last 30 days
                  </Button>
                </Box>

                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item>
                    <Typography variant="caption" color="textSecondary" fontWeight="bold">Total Visitors</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5" fontWeight="bold">42,345</Typography>
                      <Typography variant="caption" sx={{ color: '#10b981', bgcolor: alpha('#10b981', 0.1), px: 0.5, py: 0.2, borderRadius: 0.5 }}>+47%</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="textSecondary" fontWeight="bold">Total Patients</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5" fontWeight="bold">{stats?.totalPatients || '2,345'}</Typography>
                      <Typography variant="caption" sx={{ color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), px: 0.5, py: 0.2, borderRadius: 0.5 }}>-10%</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ height: 300, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#f1f5f9', 0.5), borderRadius: 4 }}>
                  <Typography variant="body2" color="textSecondary">Interaction Statistics Chart Visualization</Typography>
                </Box>
              </CardContent>
            </Card> */}

          {/* Side Cards */}
            <Stack spacing={2}>
              {/* <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', width: 40, height: 40, borderRadius: 2 }}>
                        <LocalHospital fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">Doctor Status</Typography>
                    </Box>
                    <IconButton size="small"><MoreVert /></IconButton>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold">{stats?.totalDoctors || 0}</Typography>
                    <Typography variant="caption" color="textSecondary">Active doctors on platform</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 40 }}>
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <Box key={i} sx={{ flex: 1, bgcolor: '#ef4444', height: `${h}%`, borderRadius: 1 }} />
                    ))}
                  </Box>
                </CardContent>
              </Card> */}

              {/* <Card sx={{ borderRadius: 4, bgcolor: '#1e293b', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 40, height: 40, borderRadius: 2 }}>
                        <LocalHospital fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">ASHA Workers</Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: 'white' }}><MoreVert /></IconButton>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold">{stats?.totalASHAWorkers || 0}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Registered ASHA workers</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: 40 }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.2)', px: 1, borderRadius: 1 }}>10% ↓</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', ml: 1 }}>Last 30 days</Typography>
                  </Box>
                </CardContent>
              </Card> */}
            </Stack>
        </Box>

        {/* Recent Appointment Table */}
        <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #e2e8f0', mt: 2 }}>
          <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#7c3aed', 0.1), color: '#7c3aed', width: 44, height: 44, borderRadius: 2 }}>
                      <CalendarToday fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">Recent Patient Appointment</Typography>
                      <Typography variant="caption" color="textSecondary">Keep track of patient data and others information.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        px: 2,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <InputBase placeholder="Search patient..." sx={{ fontSize: '0.9rem' }} />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#e2e8f0', color: 'text.secondary' }}
                    >
                      Filters
                    </Button>
                  </Box>
                </Box>

                <Paper sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', overflow: 'hidden', borderRadius: 2 }}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Serial Number</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Date</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>User Name</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Role</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Email</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Status</th>
                          <th style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRegistrations.length > 0 ? (
                          recentRegistrations.map((user, idx) => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '16px', fontSize: '0.9rem' }}>#{idx + 1}</td>
                              <td style={{ padding: '16px', fontSize: '0.9rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td style={{ padding: '16px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: alpha('#2563eb', 0.1), color: '#2563eb' }}>
                                    {user.name.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight="bold">{user.name}</Typography>
                                </Box>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <Chip
                                  label={user.role}
                                  size="small"
                                  sx={{
                                    bgcolor: user.role === 'doctor' ? alpha('#7c3aed', 0.1) : alpha('#10b981', 0.1),
                                    color: user.role === 'doctor' ? '#7c3aed' : '#10b981',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    textTransform: 'capitalize'
                                  }}
                                />
                              </td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b' }}>{user.email}</td>
                              <td style={{ padding: '16px' }}>
                                <Chip
                                  label="Active"
                                  size="small"
                                  sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 'bold' }}
                                />
                              </td>
                              <td style={{ padding: '16px' }}>
                                <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                              No recent registrations found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default AdminDashboard;
