import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    Chip,
    Grid,
    Divider,
    CircularProgress,
    IconButton,
    Rating,
    Stack,
    Card,
    CardContent,
    alpha
} from '@mui/material';
import {
    ArrowBack,
    LocationOn,
    Email,
    Phone,
    Star,
    WorkHistory,
    Recommend,
    VideoCall,
    Facebook,
    Instagram,
    Twitter,
    Telegram,
    WhatsApp,
    LinkedIn,
    LocalHospital,
    Badge,
    CalendarToday,
    Assessment,
    People,
    ChatBubbleOutline,
    Assignment,
    CheckCircle
} from '@mui/icons-material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/admin.api';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

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
        fetchDoctorDetails();
    }, [doctorId]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getDoctorById(doctorId);
            setDoctor(response.data);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            toast.error('Failed to load doctor details');
            navigate('/admin/doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/doctors');
    };

    // Mock data for services (can be extended in backend later)
    const services = [
        { name: 'Orthopedic consultation', price: 550 },
        { name: 'Delivery blocks', price: 460 },
        { name: 'Ultrasound injection', price: 460 },
    ];

    // Mock data for feedback
    const feedback = {
        positive: "Dr. [Doctor's Name] was excellent at explaining my condition in simple terms, which helped me understand my treatment options better.",
        constructive: "I found it a bit challenging to reach out to Dr. [Doctor's Name] with questions between appointments. It would be helpful if there were more accessible communication channels or a nurse hotline."
    };

    if (loading) {
        return (
            <DashboardLayout menuItems={menuItems}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={50} />
                </Box>
            </DashboardLayout>
        );
    }

    if (!doctor) {
        return (
            <DashboardLayout menuItems={menuItems}>
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" color="textSecondary">Doctor not found</Typography>
                    <Button onClick={handleBack} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
                        Back to Doctors
                    </Button>
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout menuItems={menuItems}>
            <Box sx={{ width: '100%', px: { xs: 1.5, sm: 2, md: 3 }, py: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={handleBack}
                            sx={{ 
                                color: '#2196f3',
                                '&:hover': { bgcolor: alpha('#2196f3', 0.1) }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
                            Doctor profile
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            background: '#2196f3',
                            '&:hover': { background: '#1976d2' }
                        }}
                    >
                        Doctor Tracking
                    </Button>
                </Box>

                {/* Main Content */}
                <Paper 
                    sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        bgcolor: '#f8fafc'
                    }}
                >
                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        <Grid container spacing={4}>
                            {/* Left Section - Doctor Info */}
                            <Grid item xs={12} lg={8}>
                                <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                    {/* Avatar */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={doctor.profileImage}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                bgcolor: '#e3f2fd',
                                                color: '#1976d2',
                                                fontSize: '2.5rem',
                                                border: '4px solid white',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {doctor.name?.charAt(0)}
                                        </Avatar>
                                        {doctor.isActive && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: 8,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    bgcolor: '#10b981',
                                                    border: '3px solid white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <CheckCircle sx={{ fontSize: 14, color: 'white' }} />
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Doctor Details */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            Dr. {doctor.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            {doctor.specialization}
                                        </Typography>

                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOn sx={{ fontSize: 18, color: '#64748b' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {doctor.address || 'Address not provided'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email sx={{ fontSize: 18, color: '#64748b' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {doctor.email}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Phone sx={{ fontSize: 18, color: '#64748b' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {doctor.phone || 'Phone not provided'}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Rating 
                                            value={4.5} 
                                            precision={0.5} 
                                            readOnly 
                                            size="small"
                                            sx={{ mt: 1.5, color: '#fbbf24' }}
                                        />
                                    </Box>
                                </Box>

                                {/* Short Bio */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        Short Bio
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 2, color: '#475569', lineHeight: 1.8 }}>
                                        <li>
                                            <Typography variant="body2">
                                                <strong>Positive Feedback:</strong> "{feedback.positive.replace("[Doctor's Name]", doctor.name)}"
                                            </Typography>
                                        </li>
                                        <li style={{ marginTop: 8 }}>
                                            <Typography variant="body2">
                                                <strong>Constructive Feedback:</strong> "{feedback.constructive.replace("[Doctor's Name]", doctor.name)}"
                                            </Typography>
                                        </li>
                                    </Box>
                                    <Button 
                                        sx={{ 
                                            mt: 1, 
                                            textTransform: 'none', 
                                            color: '#2196f3',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Read more
                                    </Button>
                                </Box>

                                {/* Services and Price List */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box 
                                            sx={{ 
                                                width: 40, 
                                                height: 40, 
                                                borderRadius: '50%', 
                                                bgcolor: alpha('#10b981', 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>$</Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            Services and price list
                                        </Typography>
                                    </Box>

                                    <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
                                        {services.map((service, index) => (
                                            <Box 
                                                key={index}
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    px: 2,
                                                    py: 1.5,
                                                    borderBottom: index < services.length - 1 ? '1px solid #f1f5f9' : 'none'
                                                }}
                                            >
                                                <Typography variant="body2">{service.name}</Typography>
                                                <Typography variant="body2" fontWeight="bold">${service.price}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button 
                                        sx={{ 
                                            mt: 1, 
                                            textTransform: 'none', 
                                            color: '#2196f3',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Read more
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Right Section - Social Media & About */}
                            <Grid item xs={12} lg={4}>
                                {/* Social Media */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                        Social Media
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: '#1877f2', 
                                                color: 'white',
                                                '&:hover': { bgcolor: '#1565c0' }
                                            }}
                                        >
                                            <Facebook />
                                        </IconButton>
                                        <IconButton 
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                                color: 'white'
                                            }}
                                        >
                                            <Instagram />
                                        </IconButton>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: '#1da1f2', 
                                                color: 'white',
                                                '&:hover': { bgcolor: '#0d8ed9' }
                                            }}
                                        >
                                            <Twitter />
                                        </IconButton>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: '#0088cc', 
                                                color: 'white',
                                                '&:hover': { bgcolor: '#0077b5' }
                                            }}
                                        >
                                            <Telegram />
                                        </IconButton>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: '#25d366', 
                                                color: 'white',
                                                '&:hover': { bgcolor: '#1eb851' }
                                            }}
                                        >
                                            <WhatsApp />
                                        </IconButton>
                                        <IconButton 
                                            sx={{ 
                                                bgcolor: '#0077b5', 
                                                color: 'white',
                                                '&:hover': { bgcolor: '#006097' }
                                            }}
                                        >
                                            <LinkedIn />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* About the Doctor Card */}
                                <Card 
                                    sx={{ 
                                        borderRadius: 3, 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                                            About the doctor
                                        </Typography>

                                        <Stack spacing={3}>
                                            {/* Experience */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box 
                                                    sx={{ 
                                                        width: 36, 
                                                        height: 36, 
                                                        borderRadius: '50%',
                                                        bgcolor: alpha('#64748b', 0.1),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <WorkHistory sx={{ fontSize: 18, color: '#64748b' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {doctor.experience || '10'} years of experience
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        At {doctor.hospital || 'oral surgery mg USA and oral surgery clinics New York'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Recommendation */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box 
                                                    sx={{ 
                                                        width: 36, 
                                                        height: 36, 
                                                        borderRadius: '50%',
                                                        bgcolor: alpha('#64748b', 0.1),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <Recommend sx={{ fontSize: 18, color: '#64748b' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        85% Recommend
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        358 patients would recommend this doctor to their friends and family
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Online Consultations */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box 
                                                    sx={{ 
                                                        width: 36, 
                                                        height: 36, 
                                                        borderRadius: '50%',
                                                        bgcolor: alpha('#64748b', 0.1),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <VideoCall sx={{ fontSize: 18, color: '#64748b' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        Online consultations
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        The consultation is possible on site and online
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            endIcon={<ArrowBack sx={{ transform: 'rotate(180deg)' }} />}
                                            sx={{
                                                mt: 3,
                                                py: 1.5,
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                background: '#2196f3',
                                                '&:hover': { background: '#1976d2' }
                                            }}
                                        >
                                            Book an appointment now
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Additional Info Card */}
                                <Card 
                                    sx={{ 
                                        mt: 2,
                                        borderRadius: 3, 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                            Registration Details
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="textSecondary">License Number</Typography>
                                                <Typography variant="body2" fontWeight="bold">{doctor.licenseNumber}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="textSecondary">Username</Typography>
                                                <Typography variant="body2" fontWeight="bold">{doctor.username || 'N/A'}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="textSecondary">Status</Typography>
                                                <Chip 
                                                    label={doctor.isActive ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    color={doctor.isActive ? 'success' : 'error'}
                                                />
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="textSecondary">Registered On</Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                            {doctor.lastLogin && (
                                                <>
                                                    <Divider />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" color="textSecondary">Last Login</Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {new Date(doctor.lastLogin).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </DashboardLayout>
    );
};

export default DoctorProfile;
