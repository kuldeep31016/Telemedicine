/**
 * LandingPage (Public Home Page)
 * This is the main public landing page shown before login
 * Accessible to all visitors, provides access to admin/doctor/patient portals
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video,
  Clock,
  ArrowRight,
  Users,
  Calendar,
  Phone,
  Mic,
  UserCog,
  Stethoscope,
  Shield,
  Brain,
  Mail,
  MapPin,
  CheckCircle,
  Activity,
  FileText,
  Send,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import heroImage from '../assets/image.png';
import imgCardiology   from '../assets/doctors/cardiology.jpg';
import imgNeurology    from '../assets/doctors/neurology.jpg';
import imgOrthopedics  from '../assets/doctors/orthopedics.jpg';
import imgObstetrics   from '../assets/doctors/Obstetrics.jpg';
import imgDermatology  from '../assets/doctors/Dermatology.jpg';
import imgUrology      from '../assets/doctors/Urology.jpg';
import imgAnesthesia   from '../assets/doctors/Anesthesia.jpg';
import imgPediatrics   from '../assets/doctors/Pediatrics.jpg';
import Modal from '../components/common/Modal';
import useAuthStore from '../store/authStore';

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Doctors', id: 'doctors' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Contact', id: 'contact' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuthStore();

  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [adminMode, setAdminMode] = useState('login');
  const [doctorMode, setDoctorMode] = useState('login');

  const [adminForm, setAdminForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [doctorForm, setDoctorForm] = useState({
    email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: ''
  });
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = navItems.map(item => item.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(ids[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (adminMode === 'register') {
        await register(adminForm.email, adminForm.password, {
          name: adminForm.name, phone: adminForm.phone, role: 'admin'
        });
        setShowAdminModal(false);
        setAdminMode('login');
        setAdminForm({ email: '', password: '', name: '', phone: '' });
        navigate('/admin/dashboard', { replace: true });
      } else {
        const userData = await login(adminForm.email, adminForm.password);
        setShowAdminModal(false);
        setAdminMode('login');
        setAdminForm({ email: '', password: '', name: '', phone: '' });
        if (userData && userData.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userData) {
          switch (userData.role) {
            case 'doctor': navigate('/doctor/dashboard', { replace: true }); break;
            case 'patient': navigate('/patient/dashboard', { replace: true }); break;
            default: navigate('/admin/dashboard', { replace: true });
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
        await register(doctorForm.email, doctorForm.password, {
          name: doctorForm.name, phone: doctorForm.phone,
          specialization: doctorForm.specialization, licenseNumber: doctorForm.licenseNumber, role: 'doctor'
        });
        setShowDoctorModal(false);
        setDoctorMode('login');
        setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });
        navigate('/doctor/dashboard', { replace: true });
      } else {
        const userData = await login(doctorForm.email, doctorForm.password);
        setShowDoctorModal(false);
        setDoctorMode('login');
        setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' });
        if (userData && userData.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (userData) {
          switch (userData.role) {
            case 'admin': navigate('/admin/dashboard', { replace: true }); break;
            case 'patient': navigate('/patient/dashboard', { replace: true }); break;
            default: navigate('/doctor/dashboard', { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Doctor auth error:', error);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you shortly.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-[#6C5DD3] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:shadow-purple-300 transition-shadow">
              <span className="text-white text-xl">◌</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Telemedicine</span>
          </button>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-[14px] font-semibold rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-[#6C5DD3] bg-purple-50'
                    : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#6C5DD3] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 text-[14px] font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-[#1A1A1A] text-white text-[14px] font-semibold rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HOME SECTION ─── */}
      <section id="home" style={{ scrollMarginTop: '96px' }}>
        <div className="pt-24 min-h-screen relative overflow-hidden z-10 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute top-15 right-[-210px] bottom-0 w-[62%] z-0"
          >
            <img src={heroImage} alt="Professional Doctors" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-white to-transparent" />
          </motion.div>

          <div className="absolute top-0 left-0 bottom-0 w-[50%] bg-white z-0" />

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
                Whether in person or online, Telemedicine connects you with certified,
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
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#1A1A1A] font-bold rounded-[25px] border border-gray-200 flex items-center gap-3 hover:bg-white transition-all shadow-lg"
                >
                  See How It Works
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center transform rotate-[-45deg]">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <button onClick={() => setShowAdminModal(true)} className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
                  <UserCog className="w-4 h-4" /> Admin Access
                </button>
                <button onClick={() => setShowDoctorModal(true)} className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
                  <Stethoscope className="w-4 h-4" /> Doctor Access
                </button>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-purple-50 flex items-center gap-3 hover:scale-105 transition-transform">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="Avatar" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">1000+ Doctors</p>
                    <p className="text-xs text-gray-500">Available 24/7</p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-transform border border-purple-50">
                  <img src="https://i.pravatar.cc/100?img=12"
                    className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-green-400" alt="Doctor" />
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
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" style={{ scrollMarginTop: '96px' }} className="pt-20 pb-16 px-10 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">

            {/* ── Left Column — Laptop mockup ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Laptop mockup */}
              <div className="relative">
                <div className="relative bg-[#1A1A1A] rounded-t-2xl p-2 shadow-2xl shadow-gray-300/60">
                  <div className="bg-gray-900 rounded-t-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <div className="flex justify-center pt-1.5 pb-1">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    </div>
                    <div className="relative bg-[#0f1923] mx-1 rounded-lg overflow-hidden" style={{ height: 'calc(100% - 20px)' }}>
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop&crop=faces"
                        alt="Doctor on video call"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white text-[10px] font-semibold">Live Consultation</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-[10px] font-semibold">HD</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                        <p className="text-white text-[11px] font-bold">Dr. Sarah Johnson</p>
                        <p className="text-green-400 text-[10px]">Cardiologist • Available</p>
                      </div>
                      <div className="absolute bottom-3 right-3 w-16 h-12 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
                        <img src="https://i.pravatar.cc/100?img=33" alt="Patient" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#2a2a2a] h-3 rounded-b-sm mx-1 shadow-md" />
                <div className="bg-[#d1d5db] h-5 rounded-b-2xl mx-[-8px] shadow-lg flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-[#b0b7c0] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* ── Right Column — Text content ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              {/* <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 mb-5">
                <span className="text-gray-400 text-sm leading-none">≡</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">About Us</span>
              </div> */}

              {/* Small purple label */}
              {/* <p className="text-[#6C5DD3] text-sm font-semibold italic mb-3">Healthcare</p> */}

              {/* Heading */}
              <h2 className="text-[42px] lg:text-[52px] font-extrabold text-[#1A1A1A] leading-[1.08] mb-5">
                Redefining <span className="text-[#6C5DD3]">Healthcare</span>
                <br />for the Modern World
              </h2>

              {/* Paragraph */}
              <p className="text-gray-500 leading-relaxed text-[14.5px] mb-8 max-w-md">
                Telemedicine was founded with a single mission — to break the barriers between
                patients and world-class medical care. We believe quality healthcare should be
                accessible to everyone, anywhere, at any time.
              </p>

              {/* 4 feature pills — 2×2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: 'HIPAA Compliant', sub: 'Your data is fully protected' },
                  { icon: CheckCircle, label: 'Verified Doctors', sub: 'All specialists are board-certified' },
                  { icon: Clock, label: 'Instant Access', sub: 'Connect in under 2 minutes' },
                  { icon: Activity, label: 'Continuous Care', sub: 'Ongoing health monitoring' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 mt-0.5">
                      <Icon className="w-4 h-4 text-[#6C5DD3]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1A1A]">{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS / TRUST BAR ─── */}
      <section className="py-8 px-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-400 font-bold uppercase tracking-[0.2em] mb-6 text-xs">
            Trusted by 5,000+ medical institutions globally
          </p>
          <div className="flex flex-wrap justify-between items-center opacity-25 grayscale gap-6">
            {['MedicalHub', 'HealthCare+', 'BioMed', 'Vitality', 'PulseNet'].map(name => (
              <span key={name} className="text-2xl font-extrabold italic">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section id="services" style={{ scrollMarginTop: '96px' }} className="pt-24 pb-10 px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">Our Services</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] mb-5 leading-tight">
              Everything You Need,<br />All in One Place
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-[15px] leading-relaxed">
              From instant consultations to long-term health management, our platform
              covers every aspect of your healthcare journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Video,    title: 'Video Consultation',    desc: 'Connect face-to-face with specialists from anywhere via HD video calls with zero setup required.',        iconBg: '#ede9fe', iconColor: '#6C5DD3' },
              { icon: Clock,    title: '24/7 Availability',     desc: 'Healthcare never sleeps. Get expert medical advice at any hour, day or night, including weekends.',        iconBg: '#dbeafe', iconColor: '#3b82f6' },
              { icon: Brain,    title: 'Mental Health Support', desc: 'Licensed therapists and psychiatrists available for counseling, therapy, and mental wellness care.',        iconBg: '#fce7f3', iconColor: '#ec4899' },
              { icon: FileText, title: 'Digital Prescriptions', desc: 'Receive e-prescriptions instantly for your medications, sent directly to your preferred pharmacy.',         iconBg: '#dcfce7', iconColor: '#16a34a' },
              { icon: Activity, title: 'Health Monitoring',     desc: 'Track your vitals, medical history, and ongoing conditions with regular check-ups and monitoring.',         iconBg: '#ffedd5', iconColor: '#ea580c' },
              { icon: Shield,   title: 'Secure & Private',      desc: 'End-to-end encrypted consultations and HIPAA-compliant data security. Your privacy guaranteed.',           iconBg: '#ccfbf1', iconColor: '#0d9488' },
            ].map(({ icon: Icon, title, desc, iconBg, iconColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-white rounded-3xl p-8 hover:-translate-y-0.5 transition-all duration-300"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon style={{ color: iconColor, width: 24, height: 24 }} />
                </div>
                <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-3">{title}</h3>
                <p className="text-gray-400 text-[13.5px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCTORS / SPECIALITIES SECTION ─── */}
      <section id="doctors" style={{ scrollMarginTop: '96px' }} className="pt-10 pb-24 px-10 bg-white">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl lg:text-[52px] font-extrabold text-[#1A1A1A] leading-tight">
              Find Your Specialities
            </h2>
          </motion.div>

          {/* Carousel */}
          {(() => {
            const specialities = [
              { label: 'Cardiology',    sub: 'Cardiology',    img: imgCardiology   },
              { label: 'Neurology',     sub: 'Neurology',     img: imgNeurology    },
              { label: 'Orthopedics',   sub: 'Orthopedics',   img: imgOrthopedics  },
              { label: 'Obstetrics',    sub: 'Obstetrics',    img: imgObstetrics   },
              { label: 'Dermatology',   sub: 'Dermatology',   img: imgDermatology  },
              { label: 'Urology',       sub: 'Urology',       img: imgUrology      },
              { label: 'Anesthesia',    sub: 'Anesthesia',    img: imgAnesthesia   },
              { label: 'Pediatrics',    sub: 'Pediatrics',    img: imgPediatrics   },
            ];

            const [activeIdx, setActiveIdx] = React.useState(1);
            const visibleCount = 5;

            const prev = () => setActiveIdx(i => Math.max(0, i - 1));
            const next = () => setActiveIdx(i => Math.min(specialities.length - 1, i + 1));

            const start = Math.max(0, Math.min(activeIdx - 2, specialities.length - visibleCount));
            const visible = specialities.slice(start, start + visibleCount);

            return (
              <div className="relative flex items-center gap-4">
                {/* Left arrow */}
                <button
                  onClick={prev}
                  disabled={activeIdx === 0}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
                </button>

                {/* Cards */}
                <div className="flex gap-4 flex-1 overflow-hidden">
                  {visible.map((sp, vi) => {
                    const isActive = sp.label === specialities[activeIdx].label;
                    return (
                      <motion.div
                        key={sp.label}
                        layout
                        onClick={() => setActiveIdx(start + vi)}
                        className="flex-1 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
                        style={{
                          backgroundColor: isActive ? '#7C6FD4' : '#ffffff',
                          boxShadow: isActive
                            ? '0 8px 32px rgba(108,93,211,0.35)'
                            : '0 2px 12px rgba(0,0,0,0.06)',
                          minHeight: '340px',
                        }}
                      >
                        {/* Doctor image — fills upper 70% */}
                        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '220px' }}>
                          <img
                            src={sp.img}
                            alt={sp.label}
                            className="w-full h-full object-cover object-top"
                            style={{ filter: isActive ? 'brightness(1.05)' : 'none' }}
                          />
                          {/* Subtle gradient fade to card bg at bottom */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-16"
                            style={{ background: `linear-gradient(to top, ${isActive ? '#7C6FD4' : '#ffffff'}, transparent)` }}
                          />
                        </div>

                        {/* Label */}
                        <div className="px-5 pb-6 pt-2 flex-shrink-0">
                          <p className={`text-[16px] font-extrabold mb-1 ${isActive ? 'text-white' : 'text-[#1A1A1A]'}`}>
                            {sp.label}
                          </p>
                          <p className={`text-[13px] ${isActive ? 'text-purple-200' : 'text-gray-400'}`}>
                            {sp.sub}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right arrow */}
                <button
                  onClick={next}
                  disabled={activeIdx === specialities.length - 1}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            );
          })()}

          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/patient/login')}
              className="px-8 py-3.5 bg-[#6C5DD3] text-white font-bold rounded-full hover:bg-[#5B4DB3] transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Book a Specialist <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="mx-10 mb-8 bg-[#1A1A1A] rounded-[40px] py-16 px-20 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          {[
            { value: '1,200+', label: 'Active Doctors' },
            { value: '50k+', label: 'Happy Patients' },
            { value: '100k+', label: 'Consultations' },
            { value: '4.9/5', label: 'Average Rating' },
          ].map(({ value, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px h-16 bg-gray-800 hidden lg:block" />}
              <div className="text-center">
                <h3 className="text-5xl font-extrabold mb-3 text-white">{value}</h3>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">{label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" style={{ scrollMarginTop: '96px' }} className="pt-16 pb-20 px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">How It Works</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">
              Get Care in 4 Simple Steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
              From sign-up to consultation, we've designed every step to be fast, simple, and stress-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Create Your Account',
                desc: 'Sign up in under 60 seconds. No paperwork, no insurance forms — just your email and you\'re in.',
              },
              {
                step: '02',
                icon: Stethoscope,
                title: 'Find a Specialist',
                desc: 'Browse verified doctors by specialty, availability, rating, or language preference.',
              },
              {
                step: '03',
                icon: Calendar,
                title: 'Book an Appointment',
                desc: 'Choose a time that works for you — same-day slots available for urgent care needs.',
              },
              {
                step: '04',
                icon: Video,
                title: 'Start Your Consultation',
                desc: 'Join your secure video session on any device. Receive a care plan and digital prescription instantly.',
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center rounded-3xl p-8 pt-12"
                style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(108,93,211,0.12)' }}
              >
                {/* Step badge — top right */}
                <span className="absolute top-4 right-4 w-9 h-9 bg-[#6C5DD3] text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md shadow-purple-300">
                  {step}
                </span>

                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-10 h-10 text-[#6C5DD3]" />
                </div>

                <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-3">{title}</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-14"
          >
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-4 bg-[#6C5DD3] text-white font-bold rounded-full hover:bg-[#5B4DB3] transition-all shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 flex items-center gap-3 text-[16px]"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="contact" style={{ scrollMarginTop: '96px' }} className="pt-16 pb-24 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">Contact Us</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-6">
                We're Here<br />to Help You
              </h2>
              <p className="text-gray-500 leading-relaxed mb-12 text-[15px]">
                Have a question, need support, or want to learn more about our platform?
                Our team is available around the clock to assist you.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: 'Phone', value: '+1 (800) 123-4567', sub: 'Mon–Sun, 24/7 support' },
                  { icon: Mail, label: 'Email', value: 'support@telemedicine.com', sub: 'We reply within 2 hours' },
                  { icon: MapPin, label: 'Office', value: '123 Health Avenue, Suite 400', sub: 'New York, NY 10001' },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#6C5DD3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">{value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <form onSubmit={handleContactSubmit} className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-7">Send a Message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5B4DB3] transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-purple-100"
                  >
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">◌</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Telemedicine</span>
          </div>

          <div className="flex gap-8 text-sm font-semibold text-gray-400">
            {['About', 'Services', 'Doctors', 'Contact'].map(link => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className="hover:text-[#6C5DD3] transition-colors uppercase tracking-widest text-xs"
              >
                {link}
              </button>
            ))}
          </div>

          <p className="text-gray-300 text-sm font-medium">
            © 2026 Telemedicine. Premium Medical Solutions.
          </p>
        </div>
      </footer>

      {/* ─── ADMIN MODAL ─── */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => { setShowAdminModal(false); setAdminMode('login'); setAdminForm({ email: '', password: '', name: '', phone: '' }); }}
        title="Admin Access"
        size="sm"
      >
        <form onSubmit={handleAdminSubmit} className="space-y-6">
          <p className="text-gray-600">
            {adminMode === 'login' ? 'Please verify your credentials to access the admin portal.' : 'Register as a new administrator.'}
          </p>
          <div className="space-y-4">
            {adminMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" required value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
              <input type="email" required value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                placeholder="admin@Telemedicine.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
            </div>
            {adminMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" required value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" required value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5B4DB3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : (adminMode === 'login' ? 'Access Admin Portal' : 'Register Admin')}
            </button>
            <button type="button"
              onClick={() => { setShowAdminModal(false); setAdminMode('login'); setAdminForm({ email: '', password: '', name: '', phone: '' }); }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
          <div className="text-center pt-2 space-y-2">
            <button type="button" onClick={() => setAdminMode(adminMode === 'login' ? 'register' : 'login')}
              className="text-sm text-[#6C5DD3] font-semibold hover:underline">
              {adminMode === 'login' ? 'Need to register? Sign up here' : 'Already registered? Login here'}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact <a href="#" className="text-[#6C5DD3] font-semibold">support@Telemedicine.com</a>
            </p>
          </div>
        </form>
      </Modal>

      {/* ─── DOCTOR MODAL ─── */}
      <Modal
        isOpen={showDoctorModal}
        onClose={() => { setShowDoctorModal(false); setDoctorMode('login'); setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' }); }}
        title="Doctor Access"
        size="sm"
      >
        <form onSubmit={handleDoctorSubmit} className="space-y-6">
          <p className="text-gray-600">
            {doctorMode === 'login' ? 'Please verify your credentials to access the doctor portal.' : 'Register as a new doctor.'}
          </p>
          <div className="space-y-4">
            {doctorMode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" required value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                  <select required value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                  <input type="text" required value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    placeholder="Medical license number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor Email</label>
              <input type="email" required value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                placeholder="doctor@Telemedicine.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
            </div>
            {doctorMode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" required value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" required value={doctorForm.password}
                onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5B4DB3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : (doctorMode === 'login' ? 'Access Doctor Portal' : 'Register Doctor')}
            </button>
            <button type="button"
              onClick={() => { setShowDoctorModal(false); setDoctorMode('login'); setDoctorForm({ email: '', password: '', name: '', phone: '', specialization: '', licenseNumber: '' }); }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
          <div className="text-center pt-2 space-y-2">
            <button type="button" onClick={() => setDoctorMode(doctorMode === 'login' ? 'register' : 'login')}
              className="text-sm text-[#6C5DD3] font-semibold hover:underline">
              {doctorMode === 'login' ? 'Need to register? Sign up here' : 'Already registered? Login here'}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact <a href="#" className="text-[#6C5DD3] font-semibold">support@Telemedicine.com</a>
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;
