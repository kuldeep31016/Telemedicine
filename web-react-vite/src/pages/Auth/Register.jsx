import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Briefcase, Heart, Calendar, ShieldCheck, PlusCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { AuthInput, AuthSelect, AuthButton, AuthSection, AuthHeader } from '../../components/auth/AuthFormElements';

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

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { password, confirmPassword, ...userData } = formData;
      const registeredUser = await register(formData.email, password, userData);

      switch (registeredUser.role) {
        case 'admin': navigate('/admin/dashboard', { replace: true }); break;
        case 'doctor': navigate('/doctor/dashboard', { replace: true }); break;
        case 'patient': navigate('/patient/dashboard', { replace: true }); break;
        case 'asha_worker': navigate('/asha/dashboard', { replace: true }); break;
        default: navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-12"
      >
        <AuthHeader
          title="Create Professional Account"
          subtitle="Healthcare Network Onboarding"
          icon={PlusCircle}
          colorClass="bg-blue-600"
        />

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            <AuthSection title="Identity Details" />
            <AuthInput
              label="Legal Full Name"
              icon={User}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Official Name"
            />
            <AuthInput
              label="System Username"
              icon={ShieldCheck}
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="username123"
            />

            <AuthInput
              label="Contact Email"
              icon={Mail}
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@provider.com"
            />
            <AuthInput
              label="Primary Phone"
              icon={Phone}
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (000) 000-0000"
            />

            {!roleParam && (
              <AuthSelect
                label="Account Role Type"
                icon={ShieldCheck}
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: "patient", label: "Patient" },
                  { value: "doctor", label: "Medical Provider" },
                  { value: "asha_worker", label: "ASHA Worker" },
                  { value: "admin", label: "Administrator" },
                ]}
              />
            )}

            {/* Conditional Roles */}
            {formData.role === 'doctor' && (
              <>
                <AuthSection title="Professional Credentials" />
                <AuthSelect
                  label="Medical Specialty"
                  icon={Heart}
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  options={[
                    { value: "", label: "Select Specialty", disabled: true },
                    { value: "General Physician", label: "General Physician" },
                    { value: "Cardiologist", label: "Cardiologist" },
                    { value: "Neurologist", label: "Neurologist" },
                    { value: "Pulmonologist", label: "Pulmonologist (Chest Specialist)" },
                    { value: "Gastroenterologist", label: "Gastroenterologist" },
                    { value: "Nephrologist", label: "Nephrologist" },
                    { value: "Endocrinologist", label: "Endocrinologist" },
                    { value: "Rheumatologist", label: "Rheumatologist" },
                    { value: "Hepatologist", label: "Hepatologist" },
                    
                    { value: "Dermatologist", label: "Dermatologist" },
                    { value: "Orthopedic", label: "Orthopedic" },
                    { value: "Psychiatrist", label: "Psychiatrist" },
                    { value: "Dentist", label: "Dentist" },
                    
                    { value: "Gynecologist", label: "Gynecologist" },
                    { value: "Obstetrician", label: "Obstetrician" },
                    { value: "OB-GYN", label: "Gynecology & Obstetrics (OB-GYN)" },
                    { value: "Reproductive Medicine Specialist", label: "Reproductive Medicine Specialist" },
                    { value: "Fertility Specialist", label: "Fertility Specialist" },
                    
                    { value: "Pediatrician", label: "Pediatrician" },
                    { value: "Neonatologist", label: "Neonatologist" },
                    { value: "Geriatric Medicine Specialist", label: "Geriatric Medicine Specialist" },
                  ]}
                />
                <AuthInput
                  label="License Number"
                  icon={Briefcase}
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="MC/825421"
                />
              </>
            )}

            {formData.role === 'asha_worker' && (
              <>
                <AuthSection title="Deployment Info" />
                <AuthInput
                  label="Assigned Health Area"
                  icon={ShieldCheck}
                  required
                  value={formData.assignedArea}
                  onChange={(e) => setFormData({ ...formData, assignedArea: e.target.value })}
                  placeholder="Village/Ward/Sector"
                />
              </>
            )}

            {formData.role === 'patient' && (
              <>
                <AuthSection title="Patient Records" />
                <AuthInput
                  label="Date of Birth"
                  icon={Calendar}
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </>
            )}

            <AuthSection title="Secure Access" />
            <AuthInput
              label="Account Password"
              icon={Lock}
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
            <AuthInput
              label="Confirm Password"
              icon={Lock}
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />

            <AuthButton
              loading={loading}
              securityText="All data is encrypted via 256-bit institutional standards"
            >
              Initialize Professional Profile
            </AuthButton>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 underline underline-offset-4 decoration-2 decoration-blue-100 font-black">
                Return to Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
