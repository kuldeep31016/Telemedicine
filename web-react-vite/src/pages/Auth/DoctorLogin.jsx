import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { MedicalServices, Mail, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await login(formData.email, formData.password);

      console.log('[DoctorLogin] User logged in:', user);

      // Verify user role
      if (user && user.role === 'doctor') {
        console.log('[DoctorLogin] Navigating to doctor dashboard');
        navigate('/doctor/dashboard', { replace: true });
      } else if (user) {
        // User logged in but not a doctor
        console.log('[DoctorLogin] User is not doctor, logging out');
        const { logout } = useAuthStore.getState();
        await logout();
        setErrors({ email: 'Access denied. Doctor credentials required.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setErrors({ email: errorMessage });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: 3
              }}
            >
              <MedicalServices sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
              Doctor Portal
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={4}>
              Sign in to manage your consultations
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In as Doctor'}
              </Button>
            </form>

            <Box mt={4} display="flex" flexDirection="column" gap={1}>
              <MuiLink component={Link} to="/" variant="body2" color="textSecondary" underline="hover">
                ← Back to Home
              </MuiLink>
              <Typography variant="body2" color="textSecondary">
                Not registered yet?{' '}
                <MuiLink component={Link} to="/register?role=doctor" fontWeight="bold" underline="hover">
                  Register as Doctor
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DoctorLogin;
