import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import {
    Search,
    Visibility,
    LocalHospital,
    People,
    Assessment,
    CalendarToday,
    CheckCircle,
    Cancel,
    ChatBubbleOutline,
    Assignment
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/admin.api';
import toast from 'react-hot-toast';

const DoctorsManagement = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getDoctors();
            setDoctors(response.data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (doctor) => {
        navigate(`/admin/doctors/${doctor._id}`);
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout menuItems={menuItems}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
                        Doctors Management
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        View and manage all registered healthcare professionals
                    </Typography>
                </Box>
            </Box>

            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
            </Paper>

            {/* Doctors Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">Doctor</TableCell>
                            <TableCell fontWeight="bold">Specialization</TableCell>
                            <TableCell fontWeight="bold">License No.</TableCell>
                            <TableCell fontWeight="bold">Status</TableCell>
                            <TableCell fontWeight="bold" align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={40} />
                                    <Typography sx={{ mt: 2 }}>Loading doctors data...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredDoctors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <Typography color="textSecondary">No doctors found matching your search.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDoctors.map((doctor) => (
                                <TableRow key={doctor._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)' }}>
                                                {doctor.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight="bold">{doctor.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">{doctor.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={doctor.specialization}
                                            size="small"
                                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell>{doctor.licenseNumber}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={doctor.isActive ? <CheckCircle size={16} /> : <Cancel size={16} />}
                                            label={doctor.isActive ? 'Active' : 'Inactive'}
                                            color={doctor.isActive ? 'success' : 'error'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => handleViewDetails(doctor)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)'
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </DashboardLayout>
    );
};

export default DoctorsManagement;
