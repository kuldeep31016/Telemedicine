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
    Avatar,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    CircularProgress,
    alpha
} from '@mui/material';
import {
    Search,
    Visibility,
    Email,
    Phone,
    People,
    Assessment,
    CalendarToday,
    ChatBubbleOutline,
    LocalHospital,
    CheckCircle,
    Cancel,
    Assignment,
    Person,
    LocationOn
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/admin.api';
import toast from 'react-hot-toast';

const PatientsManagement = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

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
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (patient) => {
        setSelectedPatient(patient);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedPatient(null);
    };

    const filteredPatients = patients.filter(patient =>
        (patient.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (patient.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (patient.phone || '').includes(searchTerm)
    );

    return (
        <DashboardLayout menuItems={menuItems}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
                    Patients Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    View and manage all registered patients on the platform.
                </Typography>
            </Box>

            {/* Search and Filters */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 4,
                    boxShadow: 'none',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        flex: 1,
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <Search sx={{ color: 'text.secondary', mr: 1 }} />
                    <InputBase
                        fullWidth
                        placeholder="Search patients by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ fontSize: '0.95rem' }}
                    />
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Person />}
                    sx={{ borderRadius: 3, textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}
                >
                    All Status
                </Button>
            </Paper>

            {/* Patients Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 4,
                    boxShadow: 'none',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Patient</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Gender</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Age</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Blood Group</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={40} thickness={4} sx={{ color: '#7c3aed' }} />
                                    <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 'medium' }}>
                                        Loading patients...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredPatients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography color="textSecondary">No patients found matching your search.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPatients.map((patient) => (
                                <TableRow key={patient._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha('#7c3aed', 0.1),
                                                    color: '#7c3aed',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {patient.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">{patient.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">{patient.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                        {patient.gender || 'N/A'}
                                    </TableCell>
                                    <TableCell>{patient.age || 'N/A'} Years</TableCell>
                                    <TableCell>
                                        {patient.bloodGroup ? (
                                            <Chip
                                                label={patient.bloodGroup}
                                                size="small"
                                                sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', fontWeight: 'bold' }}
                                            />
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={patient.isActive ? 'Active' : 'Inactive'}
                                            sx={{
                                                bgcolor: patient.isActive ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                                                color: patient.isActive ? '#10b981' : '#ef4444',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem'
                                            }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenDetails(patient)} sx={{ color: '#64748b' }}>
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" sx={{ color: '#64748b' }}>
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Patient Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={handleCloseDetails}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 5, p: 2, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha('#7c3aed', 0.1), color: '#7c3aed' }}>
                        <Person />
                    </Avatar>
                    Patient Profile
                </DialogTitle>
                <DialogContent>
                    {selectedPatient && (
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        margin: '0 auto 16px',
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                                        fontSize: '2.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
                                    }}
                                >
                                    {selectedPatient.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">{selectedPatient.name}</Typography>
                                <Typography color="textSecondary">{selectedPatient.email}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Chip label={selectedPatient.gender} size="small" sx={{ borderRadius: 1.5 }} />
                                    <Chip label={`${selectedPatient.age} Years`} size="small" sx={{ borderRadius: 1.5 }} />
                                    <Chip label={selectedPatient.bloodGroup} color="error" size="small" sx={{ borderRadius: 1.5 }} />
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="textSecondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Contact Information
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                                                <Phone sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">Phone Number</Typography>
                                                <Typography variant="body2" fontWeight="bold">{selectedPatient.phone || 'Not Provided'}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                                                <LocationOn sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">Address</Typography>
                                                <Typography variant="body2" fontWeight="bold">{selectedPatient.address || 'Address not listed'}</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #e2e8f0' }}>
                                <Typography variant="caption" color="textSecondary" display="block">Patient ID</Typography>
                                <Typography variant="mono" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedPatient._id}</Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="caption" color="textSecondary" display="block">Member Since</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {new Date(selectedPatient.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={handleCloseDetails} sx={{ borderRadius: 3, textTransform: 'none', color: '#64748b' }}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            bgcolor: '#7c3aed',
                            '&:hover': { bgcolor: '#6d28d9' }
                        }}
                    >
                        View Medical Records
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
};

// Helper InputBase to match design
const InputBase = (props) => (
    <TextField
        {...props}
        variant="standard"
        InputProps={{ disableUnderline: true, ...props.InputProps }}
    />
);

const MoreVert = (props) => (
    <IconButton {...props}>
        <Visibility sx={{ fontSize: 18 }} />
    </IconButton>
);

export default PatientsManagement;
