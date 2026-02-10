/**
 * LandingPage (Public Home Page)
 * This is the main public landing page shown before login
 * Accessible to all visitors, provides access to admin/doctor/patient portals
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Video,
  Clock,
  ArrowRight,
  Play,
  Users,
  Calendar,
  Phone,
  Mic,
  VideoOff,
  UserCog,
  Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import local assets
import heroImage from '../assets/happy-doctor-holding-clipboard-with-patients.jpg';
import Modal from '../components/common/Modal';
import useAuthStore from '../store/authStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuthStore();

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [adminMode, setAdminMode] = useState('login'); // 'login' or 'register'
  const [doctorMode, setDoctorMode] = useState('login'); // 'login' or 'register'

  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    specialization: '',
    licenseNumber: ''
  });

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (adminMode === 'register') {
        const userData = await register(adminForm.email, adminForm.password, {
          name: adminForm.name,
          phone: adminForm.phone,
          role: 'admin'
        });

        console.log('[LandingPage] Admin registration successful:', userData);

        // Close modal first
        setShowAdminModal(false);
        setAdminMode('login');
        setAdminForm({ email: '', password: '', name: '', phone: '' });

        // Navigate immediately - auth state is already updated
        navigate('/admin/dashboard', { replace: true });
      } else {
        const userData = await login(adminForm.email, adminForm.password);

        console.log('[LandingPage] Admin login successful:', userData);

        // Close modal
        setShowAdminModal(false);
        setAdminMode('login');
        setAdminForm({ email: '', password: '', name: '', phone: '' });

        // Navigate based on user role
        if (userData && userData.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userData) {
          // Redirect based on actual role
          switch (userData.role) {
            case 'doctor':
              navigate('/doctor/dashboard', { replace: true });
              break;
            case 'patient':
              navigate('/patient/dashboard', { replace: true });
              break;
            default:
              navigate('/admin/dashboard', { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Admin auth error:', error);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (doctorMode === 'register') {
        const userData = await register(doctorForm.email, doctorForm.password, {
          name: doctorForm.name,
          phone: doctorForm.phone,
          specialization: doctorForm.specialization,
          licenseNumber: doctorForm.licenseNumber,
          role: 'doctor'
        });

        console.log('[LandingPage] Doctor registration successful:', userData);

        // Close modal first
        setShowDoctorModal(false);
        setDoctorMode('login');
        setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });

        // Navigate immediately
        navigate('/doctor/dashboard', { replace: true });
      } else {
        const userData = await login(doctorForm.email, doctorForm.password);

        console.log('[LandingPage] Doctor login successful:', userData);

        // Close modal
        setShowDoctorModal(false);
        setDoctorMode('login');
        setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });

        // Navigate based on user role
        if (userData && userData.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (userData) {
          // Redirect based on actual role
          switch (userData.role) {
            case 'admin':
              navigate('/admin/dashboard', { replace: true });
              break;
            case 'patient':
              navigate('/patient/dashboard', { replace: true });
              break;
            default:
              navigate('/doctor/dashboard', { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Doctor auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-[#6C5DD3] rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">◌</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Doctify
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Doctors', 'Appointments', 'Blog', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-[15px] font-semibold ${item === 'Home' ? 'text-[#6C5DD3]' : 'text-gray-500 hover:text-[#6C5DD3] transition-colors'}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-2.5 text-[15px] font-semibold text-gray-700 border-2 border-gray-100 rounded-full hover:bg-gray-50 transition-all"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-2.5 bg-[#1A1A1A] text-white text-[15px] font-semibold rounded-full hover:bg-gray-800 transition-all active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Hero Section - Full Width Image with Floating Text */}
      <div className="pt-24 min-h-screen relative overflow-hidden z-10 pb-32">
        {/* Full Width Background Image - Positioned to the right */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-15 right-[-210px] bottom-0 w-[62%] z-0"
        >
          <img
            src={heroImage}
            alt="Professional Doctors"
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient fade on left edge */}
          <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-white to-transparent" />
        </motion.div>

        {/* White background for left side */}
        <div className="absolute top-0 left-0 bottom-0 w-[50%] bg-white z-0" />

        {/* Floating Text Content - Positioned higher */}
        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-8 pb-4 min-h-[calc(100vh-96px)] flex items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl pt-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full mb-4 border border-purple-100 shadow-sm">
              <span className="text-xs font-bold text-[#6C5DD3] uppercase tracking-wider">
                24/7 Services Available
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-4">
              Your Health, Our Technology. Trusted Doctors at Your Fingertips.
            </h1>

            <p className="text-base text-gray-600 mb-6 leading-relaxed max-w-lg">
              Whether in person or online, Doctify connects you with certified,
              compassionate healthcare professionals — quickly, safely, and effortlessly.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => navigate('/patient/login')}
                className="px-8 py-4 bg-[#6C5DD3] text-white font-bold rounded-[25px] flex items-center gap-3 shadow-xl shadow-purple-200 hover:bg-[#5B4DB3] transition-all transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs">≡</span>
                </div>
                Book Appointment
              </button>

              <button
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#1A1A1A] font-bold rounded-[25px] border border-gray-200 flex items-center gap-3 hover:bg-white transition-all shadow-lg"
              >
                See How It Works
                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center transform rotate-[-45deg]">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            </div>

            {/* Portal Access Buttons */}
            <div className="flex gap-4 mb-6">
              <button onClick={() => setShowAdminModal(true)} className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
                <UserCog className="w-4 h-4" /> Admin Access
              </button>
              <button onClick={() => setShowDoctorModal(true)} className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
                <Stethoscope className="w-4 h-4" /> Doctor Access
              </button>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Stats Card */}
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-purple-50 flex items-center gap-3 hover:scale-105 transition-transform">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      alt="Avatar"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">1000+ Doctors</p>
                  <p className="text-xs text-gray-500">Available 24/7</p>
                </div>
              </div>

              {/* Calling Card */}
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-transform border border-purple-50">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-green-400"
                  alt="Doctor"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800">Dr. Sarah</p>
                  <p className="text-xs text-green-500 font-semibold">● Online now</p>
                </div>
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Video Call Interface - Floating on bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-10 right-10 z-20 hidden lg:flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/50"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
            <Video className="w-4 h-4" />
          </div>
          <div className="w-14 h-14 rounded-full bg-[#FF4D4D] flex items-center justify-center text-white shadow-lg shadow-red-200 hover:scale-110 active:scale-95 transition-all cursor-pointer">
            <Phone className="w-6 h-6" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
            <Mic className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Partners/Trust Section */}
      <section class="py-20 px-10 mt-10 relative z-0">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-center text-gray-400 font-bold uppercase tracking-[0.2em] mb-12">Trusted by 5000+ medical institutions globally</p>
          <div className="flex flex-wrap justify-between items-center opacity-30 grayscale gap-10">
            <span className="text-4xl font-extrabold italic">MedicalHub</span>
            <span className="text-4xl font-extrabold italic">HealthCare+</span>
            <span className="text-4xl font-extrabold italic">BioMed</span>
            <span className="text-4xl font-extrabold italic">Vitality</span>
            <span className="text-4xl font-extrabold italic">PulseNet</span>
          </div>
        </div>
      </section>

      {/* Features/Stats Section - Matching the Black Bar Style but localized */}
      <section className="mx-10 my-20 bg-[#1A1A1A] rounded-[40px] py-16 px-20 text-white">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center">
            <h3 className="text-5xl font-extrabold mb-3 text-white">1,200+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Active Doctors</p>
          </div>
          <div className="w-px h-16 bg-gray-800 hidden lg:block" />
          <div className="text-center">
            <h3 className="text-5xl font-extrabold mb-3 text-white">50k+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Happy Patients</p>
          </div>
          <div className="w-px h-16 bg-gray-800 hidden lg:block" />
          <div className="text-center">
            <h3 className="text-5xl font-extrabold mb-3 text-white">100k+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Consultations</p>
          </div>
          <div className="w-px h-16 bg-gray-800 hidden lg:block" />
          <div className="text-center">
            <h3 className="text-5xl font-extrabold mb-3 text-white">4.9/5</h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-gray-50">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">◌</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              Doctify
            </span>
          </div>

          <div className="flex gap-10 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-[#6C5DD3] transition-colors uppercase tracking-widest">About</a>
            <a href="#" className="hover:text-[#6C5DD3] transition-colors uppercase tracking-widest">Solutions</a>
            <a href="#" className="hover:text-[#6C5DD3] transition-colors uppercase tracking-widest">Doctors</a>
            <a href="#" className="hover:text-[#6C5DD3] transition-colors uppercase tracking-widest">Contact</a>
          </div>

          <p className="text-gray-300 text-sm font-medium">
            © 2026 Doctify. Premium Medical Solutions.
          </p>
        </div>
      </footer>

      {/* Admin Access Modal */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setAdminMode('login');
          setAdminForm({ email: '', password: '', name: '', phone: '' });
        }}
        title="Admin Access"
        size="sm"
      >
        <form onSubmit={handleAdminSubmit} className="space-y-6">
          <p className="text-gray-600">
            {adminMode === 'login'
              ? 'Please verify your credentials to access the admin portal.'
              : 'Register as a new administrator.'}
          </p>

          <div className="space-y-4">
            {adminMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                placeholder="admin@doctify.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>

            {adminMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5B4DB3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (adminMode === 'login' ? 'Access Admin Portal' : 'Register Admin')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAdminModal(false);
                setAdminMode('login');
                setAdminForm({ email: '', password: '', name: '', phone: '' });
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="text-center pt-2 space-y-2">
            <button
              type="button"
              onClick={() => setAdminMode(adminMode === 'login' ? 'register' : 'login')}
              className="text-sm text-[#6C5DD3] font-semibold hover:underline"
            >
              {adminMode === 'login' ? 'Need to register? Sign up here' : 'Already registered? Login here'}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="#" className="text-[#6C5DD3] font-semibold">
                support@doctify.com
              </a>
            </p>
          </div>
        </form>
      </Modal>

      {/* Doctor Access Modal */}
      <Modal
        isOpen={showDoctorModal}
        onClose={() => {
          setShowDoctorModal(false);
          setDoctorMode('login');
          setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });
        }}
        title="Doctor Access"
        size="sm"
      >
        <form onSubmit={handleDoctorSubmit} className="space-y-6">
          <p className="text-gray-600">
            {doctorMode === 'login'
              ? 'Please verify your credentials to access the doctor portal.'
              : 'Register as a new doctor.'}
          </p>

          <div className="space-y-4">
            {doctorMode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    required
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="" disabled>Select Specialization</option>
                   
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pulmonologist">Pulmonologist (Chest Specialist)</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                      <option value="Nephrologist">Nephrologist</option>
                      <option value="Endocrinologist">Endocrinologist</option>
                      <option value="Rheumatologist">Rheumatologist</option>
                      <option value="Hepatologist">Hepatologist</option>
                    
                    
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Dentist">Dentist</option>
                    
                    
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Obstetrician">Obstetrician</option>
                      <option value="OB-GYN">Gynecology & Obstetrics (OB-GYN)</option>
                      <option value="Reproductive Medicine Specialist">Reproductive Medicine Specialist</option>
                      <option value="Fertility Specialist">Fertility Specialist</option>
                    
                    
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neonatologist">Neonatologist</option>
                      <option value="Geriatric Medicine Specialist">Geriatric Medicine Specialist</option>
                    
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    placeholder="Medical license number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Doctor Email
              </label>
              <input
                type="email"
                required
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                placeholder="doctor@doctify.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>

            {doctorMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={doctorForm.password}
                onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5B4DB3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (doctorMode === 'login' ? 'Access Doctor Portal' : 'Register Doctor')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDoctorModal(false);
                setDoctorMode('login');
                setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="text-center pt-2 space-y-2">
            <button
              type="button"
              onClick={() => setDoctorMode(doctorMode === 'login' ? 'register' : 'login')}
              className="text-sm text-[#6C5DD3] font-semibold hover:underline"
            >
              {doctorMode === 'login' ? 'Need to register? Sign up here' : 'Already registered? Login here'}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="#" className="text-[#6C5DD3] font-semibold">
                support@doctify.com
              </a>
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;
