import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const validRoles = ['patient', 'doctor', 'asha_worker', 'admin'];
  const initialRole = validRoles.includes(roleParam) ? roleParam : 'patient';

  const { register, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    specialization: '',
    licenseNumber: '',
    assignedArea: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role specific validation
    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License Number is required';
    }

    if (formData.role === 'asha_worker') {
      if (!formData.assignedArea.trim()) newErrors.assignedArea = 'Assigned Area is required';
    }

    if (formData.role === 'patient') {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Extract password and confirmPassword from formData
      // Do NOT send password to backend - Firebase handles it
      const { password, confirmPassword, ...userData } = formData;
      
      const registeredUser = await register(formData.email, password, userData);
      
      console.log('[Register] User registered successfully:', registeredUser);
      
      // No need to manually navigate - PublicRoute will handle redirect
      // after user state updates in authStore
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Join our telemedicine platform
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {roleParam ? (
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      helperText={errors.username}
                      variant="outlined"
                    />
                  ) : (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                      >
                        <MenuItem value="patient">Patient</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="asha_worker">ASHA Worker</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                {!roleParam && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      helperText={errors.username}
                      variant="outlined"
                    />
                  </Grid>
                )}

                {/* Conditional Fields based on Role */}
                {formData.role === 'doctor' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        error={!!errors.specialization}
                        helperText={errors.specialization}
                        variant="outlined"
                        placeholder="e.g. Cardiologist"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="License Number"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        error={!!errors.licenseNumber}
                        helperText={errors.licenseNumber}
                        variant="outlined"
                      />
                    </Grid>
                  </>
                )}

                {formData.role === 'asha_worker' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Assigned Area"
                      name="assignedArea"
                      value={formData.assignedArea}
                      onChange={handleChange}
                      error={!!errors.assignedArea}
                      helperText={errors.assignedArea}
                      variant="outlined"
                      placeholder="e.g. Village Name, Ward No."
                    />
                  </Grid>
                )}

                {formData.role === 'patient' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox required color="primary" />}
                    label={
                      <Typography variant="body2" color="textSecondary">
                        I agree to the{' '}
                        <MuiLink component={Link} to="/terms" underline="hover">
                          Terms of Service
                        </MuiLink>{' '}
                        and{' '}
                        <MuiLink component={Link} to="/privacy" underline="hover">
                          Privacy Policy
                        </MuiLink>
                      </Typography>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.1rem' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" variant="subtitle2" underline="hover" fontWeight="bold">
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
