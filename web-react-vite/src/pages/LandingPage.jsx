/**
 * LandingPage (Public Home Page)
 * This is the main public landing page shown before login
 * Accessible to all visitors, provides access to admin/doctor/patient portals
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../config/axios";

import heroImage from "../assets/image.png";
import imgCardiology from "../assets/doctors/cardiology.jpg";
import imgNeurology from "../assets/doctors/neurology.jpg";
import imgOrthopedics from "../assets/doctors/orthopedics.jpg";
import imgObstetrics from "../assets/doctors/Obstetrics.jpg";
import imgDermatology from "../assets/doctors/Dermatology.jpg";
import imgUrology from "../assets/doctors/Urology.jpg";
import imgAnesthesia from "../assets/doctors/Anesthesia.jpg";
import imgPediatrics from "../assets/doctors/Pediatrics.jpg";
import Modal from "../components/common/Modal";
import useAuthStore from "../store/authStore";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Doctors", id: "doctors" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Contact", id: "contact" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuthStore();

  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [adminMode, setAdminMode] = useState("login");
  const [doctorMode, setDoctorMode] = useState("login");

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [doctorForm, setDoctorForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = navItems.map((item) => item.id);
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (adminMode === "register") {
        await register(adminForm.email, adminForm.password, {
          name: adminForm.name,
          phone: adminForm.phone,
          role: "admin",
        });
        setShowAdminModal(false);
        setAdminMode("login");
        setAdminForm({ email: "", password: "", name: "", phone: "" });
        navigate("/admin/dashboard", { replace: true });
      } else {
        const userData = await login(adminForm.email, adminForm.password);
        setShowAdminModal(false);
        setAdminMode("login");
        setAdminForm({ email: "", password: "", name: "", phone: "" });
        if (userData && userData.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userData) {
          switch (userData.role) {
            case "doctor":
              navigate("/doctor/dashboard", { replace: true });
              break;
            case "patient":
              navigate("/patient/dashboard", { replace: true });
              break;
            default:
              navigate("/admin/dashboard", { replace: true });
          }
        }
      }
    } catch (error) {
      console.error("Admin auth error:", error);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (doctorMode === "register") {
        await register(doctorForm.email, doctorForm.password, {
          name: doctorForm.name,
          phone: doctorForm.phone,
          specialization: doctorForm.specialization,
          licenseNumber: doctorForm.licenseNumber,
          role: "doctor",
        });
        setShowDoctorModal(false);
        setDoctorMode("login");
        setDoctorForm({
          email: "",
          password: "",
          name: "",
          phone: "",
          specialization: "",
          licenseNumber: "",
        });
        navigate("/doctor/dashboard", { replace: true });
      } else {
        const userData = await login(doctorForm.email, doctorForm.password);
        setShowDoctorModal(false);
        setDoctorMode("login");
        setDoctorForm({
          email: "",
          password: "",
          name: "",
          phone: "",
          specialization: "",
          licenseNumber: "",
        });
        if (userData && userData.role === "doctor") {
          navigate("/doctor/dashboard", { replace: true });
        } else if (userData) {
          switch (userData.role) {
            case "admin":
              navigate("/admin/dashboard", { replace: true });
              break;
            case "patient":
              navigate("/patient/dashboard", { replace: true });
              break;
            default:
              navigate("/doctor/dashboard", { replace: true });
          }
        }
      }
    } catch (error) {
      console.error("Doctor auth error:", error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/v1/contact", contactForm);
      toast.success("Message sent! We'll get back to you shortly.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-[#6C5DD3] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:shadow-purple-300 transition-shadow">
              <span className="text-white text-xl">◌</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Telemedicine
            </span>
          </button>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-[14px] font-semibold rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-[#6C5DD3] bg-purple-50"
                    : "text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50"
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
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 text-[14px] font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-[#1A1A1A] text-white text-[14px] font-semibold rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HOME SECTION ─── */}
      <section id="home" style={{ scrollMarginTop: "96px" }}>
        <div className="pt-24 min-h-screen relative overflow-hidden z-10 pb-32">
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
                Whether in person or online, Telemedicine connects you with
                certified, compassionate healthcare professionals — quickly,
                safely, and effortlessly.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  onClick={() => navigate("/patient/login")}
                  className="px-8 py-4 bg-[#6C5DD3] text-white font-bold rounded-[25px] flex items-center gap-3 shadow-xl shadow-purple-200 hover:bg-[#5B4DB3] transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs">≡</span>
                  </div>
                  Book Appointment
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#1A1A1A] font-bold rounded-[25px] border border-gray-200 flex items-center gap-3 hover:bg-white transition-all shadow-lg"
                >
                  See How It Works
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center transform rotate-[-45deg]">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100"
                >
                  <UserCog className="w-4 h-4" /> Admin Access
                </button>
                <button
                  onClick={() => setShowDoctorModal(true)}
                  className="text-sm font-bold flex items-center gap-2 text-[#6C5DD3] hover:text-[#5B4DB3] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100"
                >
                  <Stethoscope className="w-4 h-4" /> Doctor Access
                </button>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
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
                    <p className="text-sm font-bold text-gray-800">
                      1000+ Doctors
                    </p>
                    <p className="text-xs text-gray-500">Available 24/7</p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-transform border border-purple-50">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-green-400"
                    alt="Doctor"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Dr. Sarah</p>
                    <p className="text-xs text-green-500 font-semibold">
                      ● Online now
                    </p>
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
      <section
        id="about"
        style={{ scrollMarginTop: "96px" }}
        className="pt-20 pb-16 px-10 overflow-hidden bg-white"
      >
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
                  <div
                    className="bg-gray-900 rounded-t-xl overflow-hidden"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <div className="flex justify-center pt-1.5 pb-1">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    </div>
                    <div
                      className="relative bg-[#0f1923] mx-1 rounded-lg overflow-hidden"
                      style={{ height: "calc(100% - 20px)" }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop&crop=faces"
                        alt="Doctor on video call"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white text-[10px] font-semibold">
                            Live Consultation
                          </span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-[10px] font-semibold">
                            HD
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                        <p className="text-white text-[11px] font-bold">
                          Dr. Sarah Johnson
                        </p>
                        <p className="text-green-400 text-[10px]">
                          Cardiologist • Available
                        </p>
                      </div>
                      <div className="absolute bottom-3 right-3 w-16 h-12 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
                        <img
                          src="https://i.pravatar.cc/100?img=33"
                          alt="Patient"
                          className="w-full h-full object-cover"
                        />
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
                <br />
                for the Modern World
              </h2>

              {/* Paragraph */}
              <p className="text-gray-500 leading-relaxed text-[14.5px] mb-8 max-w-md">
                Telemedicine was founded with a single mission — to break the
                barriers between patients and world-class medical care. We
                believe quality healthcare should be accessible to everyone,
                anywhere, at any time.
              </p>

              {/* 4 feature pills — 2×2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Shield,
                    label: "HIPAA Compliant",
                    sub: "Your data is fully protected",
                  },
                  {
                    icon: CheckCircle,
                    label: "Verified Doctors",
                    sub: "All specialists are board-certified",
                  },
                  {
                    icon: Clock,
                    label: "Instant Access",
                    sub: "Connect in under 2 minutes",
                  },
                  {
                    icon: Activity,
                    label: "Continuous Care",
                    sub: "Ongoing health monitoring",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 mt-0.5">
                      <Icon className="w-4 h-4 text-[#6C5DD3]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1A1A]">
                        {label}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        {sub}
                      </p>
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
            {[
              "MedicalHub",
              "HealthCare+",
              "BioMed",
              "Vitality",
              "PulseNet",
            ].map((name) => (
              <span key={name} className="text-2xl font-extrabold italic">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section
        id="services"
        style={{ scrollMarginTop: "96px" }}
        className="pt-24 pb-10 px-10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">
              Our Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] mb-5 leading-tight">
              Everything You Need,
              <br />
              All in One Place
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-[15px] leading-relaxed">
              From instant consultations to long-term health management, our
              platform covers every aspect of your healthcare journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Video,
                title: "Video Consultation",
                desc: "Connect face-to-face with specialists from anywhere via HD video calls with zero setup required.",
                iconBg: "#ede9fe",
                iconColor: "#6C5DD3",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                desc: "Healthcare never sleeps. Get expert medical advice at any hour, day or night, including weekends.",
                iconBg: "#dbeafe",
                iconColor: "#3b82f6",
              },
              {
                icon: Brain,
                title: "Mental Health Support",
                desc: "Licensed therapists and psychiatrists available for counseling, therapy, and mental wellness care.",
                iconBg: "#fce7f3",
                iconColor: "#ec4899",
              },
              {
                icon: FileText,
                title: "Digital Prescriptions",
                desc: "Receive e-prescriptions instantly for your medications, sent directly to your preferred pharmacy.",
                iconBg: "#dcfce7",
                iconColor: "#16a34a",
              },
              {
                icon: Activity,
                title: "Health Monitoring",
                desc: "Track your vitals, medical history, and ongoing conditions with regular check-ups and monitoring.",
                iconBg: "#ffedd5",
                iconColor: "#ea580c",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "End-to-end encrypted consultations and HIPAA-compliant data security. Your privacy guaranteed.",
                iconBg: "#ccfbf1",
                iconColor: "#0d9488",
              },
            ].map(({ icon: Icon, title, desc, iconBg, iconColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-white rounded-3xl p-8 hover:-translate-y-0.5 transition-all duration-300"
                style={{
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon style={{ color: iconColor, width: 24, height: 24 }} />
                </div>
                <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-3">
                  {title}
                </h3>
                <p className="text-gray-400 text-[13.5px] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCTORS / SPECIALITIES SECTION ─── */}
      <section
        id="doctors"
        style={{ scrollMarginTop: "96px" }}
        className="pt-10 pb-24 px-10 bg-white"
      >
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
              { label: "Cardiology", sub: "Cardiology", img: imgCardiology },
              { label: "Neurology", sub: "Neurology", img: imgNeurology },
              { label: "Orthopedics", sub: "Orthopedics", img: imgOrthopedics },
              { label: "Obstetrics", sub: "Obstetrics", img: imgObstetrics },
              { label: "Dermatology", sub: "Dermatology", img: imgDermatology },
              { label: "Urology", sub: "Urology", img: imgUrology },
              { label: "Anesthesia", sub: "Anesthesia", img: imgAnesthesia },
              { label: "Pediatrics", sub: "Pediatrics", img: imgPediatrics },
            ];

            const [activeIdx, setActiveIdx] = React.useState(1);
            const visibleCount = 5;

            const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
            const next = () =>
              setActiveIdx((i) => Math.min(specialities.length - 1, i + 1));

            const start = Math.max(
              0,
              Math.min(activeIdx - 2, specialities.length - visibleCount),
            );
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
                          backgroundColor: isActive ? "#7C6FD4" : "#ffffff",
                          boxShadow: isActive
                            ? "0 8px 32px rgba(108,93,211,0.35)"
                            : "0 2px 12px rgba(0,0,0,0.06)",
                          minHeight: "340px",
                        }}
                      >
                        {/* Doctor image — fills upper 70% */}
                        <div
                          className="flex-1 relative overflow-hidden"
                          style={{ minHeight: "220px" }}
                        >
                          <img
                            src={sp.img}
                            alt={sp.label}
                            className="w-full h-full object-cover object-top"
                            style={{
                              filter: isActive ? "brightness(1.05)" : "none",
                            }}
                          />
                          {/* Subtle gradient fade to card bg at bottom */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-16"
                            style={{
                              background: `linear-gradient(to top, ${isActive ? "#7C6FD4" : "#ffffff"}, transparent)`,
                            }}
                          />
                        </div>

                        {/* Label */}
                        <div className="px-5 pb-6 pt-2 flex-shrink-0">
                          <p
                            className={`text-[16px] font-extrabold mb-1 ${isActive ? "text-white" : "text-[#1A1A1A]"}`}
                          >
                            {sp.label}
                          </p>
                          <p
                            className={`text-[13px] ${isActive ? "text-purple-200" : "text-gray-400"}`}
                          >
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
              onClick={() => navigate("/patient/login")}
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
            { value: "1,200+", label: "Active Doctors" },
            { value: "50k+", label: "Happy Patients" },
            { value: "100k+", label: "Consultations" },
            { value: "4.9/5", label: "Average Rating" },
          ].map(({ value, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className="w-px h-16 bg-gray-800 hidden lg:block" />
              )}
              <div className="text-center">
                <h3 className="text-5xl font-extrabold mb-3 text-white">
                  {value}
                </h3>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                  {label}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section
        id="how-it-works"
        style={{ scrollMarginTop: "96px" }}
        className="pt-16 pb-20 px-10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">
              How It Works
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">
              Get Care in 4 Simple Steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
              From sign-up to consultation, we've designed every step to be
              fast, simple, and stress-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create Your Account",
                desc: "Sign up in under 60 seconds. No paperwork, no insurance forms — just your email and you're in.",
              },
              {
                step: "02",
                icon: Stethoscope,
                title: "Find a Specialist",
                desc: "Browse verified doctors by specialty, availability, rating, or language preference.",
              },
              {
                step: "03",
                icon: Calendar,
                title: "Book an Appointment",
                desc: "Choose a time that works for you — same-day slots available for urgent care needs.",
              },
              {
                step: "04",
                icon: Video,
                title: "Start Your Consultation",
                desc: "Join your secure video session on any device. Receive a care plan and digital prescription instantly.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center rounded-3xl p-8 pt-12"
                style={{
                  backgroundColor: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(108,93,211,0.12)",
                }}
              >
                {/* Step badge — top right */}
                <span className="absolute top-4 right-4 w-9 h-9 bg-[#6C5DD3] text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md shadow-purple-300">
                  {step}
                </span>

                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-10 h-10 text-[#6C5DD3]" />
                </div>

                <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  {desc}
                </p>
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
              onClick={() => navigate("/register")}
              className="px-12 py-4 bg-[#6C5DD3] text-white font-bold rounded-full hover:bg-[#5B4DB3] transition-all shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 flex items-center gap-3 text-[16px]"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section
        id="contact"
        style={{ scrollMarginTop: "96px" }}
        className="pt-16 pb-24 px-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C5DD3] mb-4 block">
                Contact Us
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-6">
                We're Here
                <br />
                to Help You
              </h2>
              <p className="text-gray-500 leading-relaxed mb-12 text-[15px]">
                Have a question, need support, or want to learn more about our
                platform? Our team is available around the clock to assist you.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 9508874235",
                    sub: "Mon–Sun, 24/7 support",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "soonlay.tech@gmail.com",
                    sub: "We reply within 2 hours",
                  },
                  {
                    icon: MapPin,
                    label: "Office",
                    value: "Telemedicine",
                    sub: "Kumarswamy Layout, Bengaluru, 560078",
                  },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#6C5DD3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {label}
                      </p>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">
                        {value}
                      </p>
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
              <form
                onSubmit={handleContactSubmit}
                className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-7">
                  Send a Message
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          subject: e.target.value,
                        })
                      }
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C5DD3] focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
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
      <footer className="pb-8 pt-0 px-6">
        <div
          className="w-full rounded-3xl px-16 pt-10 pb-6"
          style={{ backgroundColor: "#6C5DD3" }}
        >
          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10 pb-8 border-b border-white/20">
            {/* Col 1 — Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">◌</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Telemedicine
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Connecting patients with certified doctors anytime, anywhere,
                through secure and reliable digital healthcare.
              </p>
              <div className="flex items-center gap-3">
                {/* LinkedIn */}
                <button onClick={() =>
                    window.open("https://www.linkedin.com/company/soonlaytech/", "_blank")
                  }
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                  </svg>
                </button>
                {/* Instagram */}
                <button onClick={() =>
                    window.open("https://www.instagram.com/soonlay.tech/", "_blank")
                  }
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
                {/* X / Twitter */}
                <button
                  onClick={() =>
                    window.open("https://twitter.com/@SoonlayTech", "_blank")
                  }
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Col 2 — Company */}
            <div>
              <h4 className="text-white font-bold mb-3 text-[15px]">Company</h4>
              <ul className="space-y-1">
                {[
                  { label: "About", id: "about" },
                  { label: "Services", id: "services" },
                  { label: "Doctors", id: "doctors" },
                  { label: "How It Works", id: "how-it-works" },
                ].map(({ label, id }) => (
                  <li key={label}>
                    <button
                      onClick={() => id && scrollToSection(id)}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Services */}
            <div>
              <h4 className="text-white font-bold mb-3 text-[15px]">
                Services
              </h4>
              <ul className="space-y-1">
                {[
                  "Video Consultation",
                  "Health Monitoring",
                  "Digital Prescriptions",
                  "Mental Health Care",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="text-white/60 hover:text-white transition-colors text-sm text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — For Patients */}
            <div>
              <h4 className="text-white font-bold mb-3 text-[15px]">
                For Patients
              </h4>
              <ul className="space-y-1">
                {[
                  { label: "Book Appointment", id: "home" },
                  { label: "Find a Doctor", id: "doctors" },
                  { label: "My Prescriptions", id: null },
                  { label: "Medical Records", id: null },
                  { label: "Emergency Care", id: "contact" },
                ].map(({ label, id }) => (
                  <li key={label}>
                    <button
                      onClick={() => id && scrollToSection(id)}
                      className="text-white/60 hover:text-white transition-colors text-sm text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 5 — Contact */}
            <div>
              <h4 className="text-white font-bold mb-3 text-[15px]">Contact</h4>
              <ul className="space-y-1">
                <li className="text-white/60 text-sm">
                  soonlay.tech@gmail.com
                </li>
                <li className="text-white/60 text-sm">+91 9508874235</li>
                <li className="text-white/60 text-sm">Bengaluru, Karnataka</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-5">
            <p className="text-white/40 text-sm">
              © 2026 Telemedicine. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              {[
                {
                  label: "Privacy Policy",
                  action: () => setShowPrivacyModal(true),
                },
                { label: "Terms", action: () => setShowTermsModal(true) },
                { label: "Security", action: () => setShowSecurityModal(true) },
              ].map(({ label, action }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <span className="text-white/20">•</span>}
                  <button
                    onClick={action}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── ADMIN MODAL ─── */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setAdminMode("login");
          setAdminForm({ email: "", password: "", name: "", phone: "" });
        }}
        title="Admin Access"
        size="sm"
      >
        <form onSubmit={handleAdminSubmit} className="space-y-6">
          <p className="text-gray-600">
            {adminMode === "login"
              ? "Please verify your credentials to access the admin portal."
              : "Register as a new administrator."}
          </p>
          <div className="space-y-4">
            {adminMode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
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
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                placeholder="admin@Telemedicine.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>
            {adminMode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={adminForm.phone}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, phone: e.target.value })
                  }
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
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
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
              {loading
                ? "Processing..."
                : adminMode === "login"
                  ? "Access Admin Portal"
                  : "Register Admin"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAdminModal(false);
                setAdminMode("login");
                setAdminForm({ email: "", password: "", name: "", phone: "" });
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="text-center pt-2 space-y-2">
            <button
              type="button"
              onClick={() =>
                setAdminMode(adminMode === "login" ? "register" : "login")
              }
              className="text-sm text-[#6C5DD3] font-semibold hover:underline"
            >
              {adminMode === "login"
                ? "Need to register? Sign up here"
                : "Already registered? Login here"}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact{" "}
              <a href="#" className="text-[#6C5DD3] font-semibold">
                soonlay.tech@gmail.com
              </a>
            </p>
          </div>
        </form>
      </Modal>

      {/* ─── DOCTOR MODAL ─── */}
      <Modal
        isOpen={showDoctorModal}
        onClose={() => {
          setShowDoctorModal(false);
          setDoctorMode("login");
          setDoctorForm({
            email: "",
            password: "",
            name: "",
            phone: "",
            specialization: "",
            licenseNumber: "",
          });
        }}
        title="Doctor Access"
        size="sm"
      >
        <form onSubmit={handleDoctorSubmit} className="space-y-6">
          <p className="text-gray-600">
            {doctorMode === "login"
              ? "Please verify your credentials to access the doctor portal."
              : "Register as a new doctor."}
          </p>
          <div className="space-y-4">
            {doctorMode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="" disabled>
                      Select Specialization
                    </option>
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pulmonologist">
                      Pulmonologist (Chest Specialist)
                    </option>
                    <option value="Gastroenterologist">
                      Gastroenterologist
                    </option>
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
                    <option value="OB-GYN">
                      Gynecology & Obstetrics (OB-GYN)
                    </option>
                    <option value="Reproductive Medicine Specialist">
                      Reproductive Medicine Specialist
                    </option>
                    <option value="Fertility Specialist">
                      Fertility Specialist
                    </option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neonatologist">Neonatologist</option>
                    <option value="Geriatric Medicine Specialist">
                      Geriatric Medicine Specialist
                    </option>
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
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        licenseNumber: e.target.value,
                      })
                    }
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
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, email: e.target.value })
                }
                placeholder="doctor@Telemedicine.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5DD3] focus:outline-none transition-colors"
              />
            </div>
            {doctorMode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={doctorForm.phone}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, phone: e.target.value })
                  }
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
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, password: e.target.value })
                }
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
              {loading
                ? "Processing..."
                : doctorMode === "login"
                  ? "Access Doctor Portal"
                  : "Register Doctor"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDoctorModal(false);
                setDoctorMode("login");
                setDoctorForm({
                  email: "",
                  password: "",
                  name: "",
                  phone: "",
                  specialization: "",
                  licenseNumber: "",
                });
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="text-center pt-2 space-y-2">
            <button
              type="button"
              onClick={() =>
                setDoctorMode(doctorMode === "login" ? "register" : "login")
              }
              className="text-sm text-[#6C5DD3] font-semibold hover:underline"
            >
              {doctorMode === "login"
                ? "Need to register? Sign up here"
                : "Already registered? Login here"}
            </button>
            <p className="text-sm text-gray-500">
              Need help? Contact{" "}
              <a href="#" className="text-[#6C5DD3] font-semibold">
                soonlay.tech@gmail.com
              </a>
            </p>
          </div>
        </form>
      </Modal>

      {/* ─── PRIVACY POLICY MODAL ─── */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
        size="lg"
      >
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Last updated: March 1, 2026
          </p>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              1. Introduction
            </h3>
            <p>
              Telemedicine Platform ("we", "our", or "us") is committed to
              protecting your personal health information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our telemedicine services, website, and
              mobile application.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              2. Information We Collect
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Personal Identifiers:</strong> Name, email address,
                phone number, date of birth, and profile photo.
              </li>
              <li>
                <strong>Medical Information:</strong> Symptoms, medical history,
                prescriptions, lab results, diagnoses, and consultation notes.
              </li>
              <li>
                <strong>Payment Information:</strong> Billing address and
                transaction records (card details are processed by our payment
                provider and not stored on our servers).
              </li>
              <li>
                <strong>Device & Usage Data:</strong> IP address, browser type,
                device identifiers, pages visited, and session duration for
                platform improvement.
              </li>
              <li>
                <strong>Communications:</strong> Messages exchanged with
                doctors, support tickets, and contact form submissions.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              3. How We Use Your Information
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Facilitate appointments between patients and licensed healthcare
                providers.
              </li>
              <li>
                Generate and deliver digital prescriptions and medical records.
              </li>
              <li>
                Send appointment confirmations, reminders, and health updates
                via email or SMS.
              </li>
              <li>Process payments and issue invoices.</li>
              <li>Improve and personalise the platform experience.</li>
              <li>
                Comply with applicable healthcare laws and regulations,
                including HIPAA.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              4. HIPAA Compliance
            </h3>
            <p>
              We are fully compliant with the Health Insurance Portability and
              Accountability Act (HIPAA). All Protected Health Information (PHI)
              is encrypted at rest and in transit. We enter into Business
              Associate Agreements (BAAs) with all third-party service providers
              who handle PHI on our behalf.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              5. Sharing of Information
            </h3>
            <p>
              We do not sell, rent, or trade your personal or medical
              information. We may share data only in the following limited
              circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                With the treating physician or healthcare professional for your
                consultation.
              </li>
              <li>
                With laboratories or pharmacies when a prescription or test
                order is issued.
              </li>
              <li>
                With payment processors strictly for transaction processing.
              </li>
              <li>
                When required by law, court order, or to protect the safety of
                individuals.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              6. Data Retention
            </h3>
            <p>
              Medical records and consultation history are retained for a
              minimum of 7 years in accordance with healthcare regulations. You
              may request deletion of non-medical personal data at any time by
              contacting us at support@telemedicine.com.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              7. Your Rights
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Access and download your personal data and medical records.
              </li>
              <li>
                Correct inaccurate or incomplete information in your profile.
              </li>
              <li>
                Withdraw consent for non-essential data processing at any time.
              </li>
              <li>
                Lodge a complaint with your national data protection authority.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              8. Contact Us
            </h3>
            <p>
              For privacy-related inquiries, please contact our Data Protection
              Officer at{" "}
              <span className="text-[#6C5DD3] font-semibold">
                soonlay.tech@gmail.com
              </span>{" "}
              or call +91 9508874235.
            </p>
          </div>
        </div>
      </Modal>

      {/* ─── TERMS OF SERVICE MODAL ─── */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
        size="lg"
      >
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Last updated: March 1, 2026
          </p>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using Telemedicine Platform, you agree to be bound
              by these Terms of Service and our Privacy Policy. If you do not
              agree, please discontinue use of the platform immediately.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              2. Eligibility
            </h3>
            <p>
              You must be at least 18 years of age to create an account. Minors
              may use the platform only with a parent or legal guardian serving
              as the account holder and consenting to all consultations on their
              behalf.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              3. Nature of Services
            </h3>
            <p>
              Telemedicine Platform provides a technology infrastructure that
              connects patients with independently licensed healthcare
              professionals. We do not employ doctors directly. All medical
              decisions, diagnoses, and treatment recommendations are made
              solely by the licensed practitioner conducting the consultation.
            </p>
            <p className="mt-2 font-semibold text-gray-700">
              This platform is not intended for medical emergencies. In case of
              a life-threatening emergency, call 911 or your local emergency
              number immediately.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              4. User Responsibilities
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Provide accurate, complete, and up-to-date personal and medical
                information.
              </li>
              <li>
                Keep your account credentials confidential and notify us
                immediately of any unauthorised access.
              </li>
              <li>
                Use the platform only for lawful purposes and not to engage in
                any fraudulent or abusive behaviour.
              </li>
              <li>
                Attend scheduled appointments on time; repeated no-shows may
                result in account suspension.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              5. Appointments & Cancellations
            </h3>
            <p>
              You may cancel or reschedule an appointment at no charge up to 24
              hours before the scheduled time. Cancellations made within 24
              hours may incur a cancellation fee as described in our Refund
              Policy. No-shows are non-refundable.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              6. Payments & Refunds
            </h3>
            <p>
              All consultation fees are displayed before booking and are charged
              at the time of confirmation. Refunds are processed within 5–7
              business days in the event of a technical failure or if the doctor
              fails to attend the consultation. Disputes must be raised within
              14 days of the appointment date.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              7. Intellectual Property
            </h3>
            <p>
              All content on this platform — including but not limited to text,
              graphics, logos, and software — is the exclusive property of
              Telemedicine Platform and is protected by applicable intellectual
              property laws. You may not reproduce or distribute any content
              without prior written consent.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              8. Limitation of Liability
            </h3>
            <p>
              Telemedicine Platform is not liable for any indirect, incidental,
              or consequential damages arising from your use of the services.
              Our total liability in any matter shall not exceed the amount paid
              by you for the specific consultation in question.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              9. Modifications
            </h3>
            <p>
              We reserve the right to update these Terms at any time. Continued
              use of the platform after changes constitutes acceptance of the
              revised Terms.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              10. Contact
            </h3>
            <p>
              Questions regarding these Terms may be directed to{" "}
              <span className="text-[#6C5DD3] font-semibold">
                soonlay.tech@gmail.com
              </span>
              .
            </p>
          </div>
        </div>
      </Modal>

      {/* ─── SECURITY MODAL ─── */}
      <Modal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        title="Security"
        size="lg"
      >
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Last updated: March 1, 2026
          </p>

          <p>
            At Telemedicine Platform, the security of your health data is our
            highest priority. We employ industry-leading security practices to
            ensure that your personal and medical information remains protected
            at every layer of our system.
          </p>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              1. Data Encryption
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>In Transit:</strong> All data transmitted between your
                browser or app and our servers is encrypted using TLS 1.3
                (Transport Layer Security).
              </li>
              <li>
                <strong>At Rest:</strong> All stored data, including medical
                records, consultation notes, and prescriptions, is encrypted
                using AES-256 encryption.
              </li>
              <li>
                <strong>Video Consultations:</strong> All video calls are
                end-to-end encrypted and are not recorded or stored without
                explicit patient consent.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              2. Authentication & Access Control
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Multi-factor authentication (MFA) is available and strongly
                recommended for all accounts.
              </li>
              <li>
                Role-based access control ensures that doctors, patients, and
                administrators can only access data relevant to their role.
              </li>
              <li>
                Session tokens expire automatically after periods of inactivity.
              </li>
              <li>
                All login attempts and access events are logged for audit
                purposes.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              3. Infrastructure Security
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Our platform is hosted on enterprise-grade cloud infrastructure
                with 99.9% uptime SLA.
              </li>
              <li>
                Regular penetration testing is conducted by independent
                third-party security firms.
              </li>
              <li>
                Automated vulnerability scanning runs continuously on all
                services.
              </li>
              <li>
                DDoS protection and Web Application Firewall (WAF) are deployed
                across all endpoints.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              4. HIPAA & Regulatory Compliance
            </h3>
            <p>
              Our platform is fully HIPAA-compliant. We conduct annual HIPAA
              risk assessments, maintain comprehensive audit trails, and enforce
              strict workforce training on data handling procedures. All
              Business Associate Agreements (BAAs) are in place with service
              providers who process Protected Health Information (PHI).
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              5. Incident Response
            </h3>
            <p>
              We have a dedicated security incident response team available
              24/7. In the event of a data breach, affected users will be
              notified within 72 hours in compliance with applicable
              regulations. We maintain a detailed incident response plan that is
              tested quarterly.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              6. Payment Security
            </h3>
            <p>
              We do not store credit card or bank account details on our
              servers. All payment processing is handled by PCI DSS Level 1
              certified payment providers. Transactions are tokenised to prevent
              any exposure of sensitive financial data.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              7. Report a Security Issue
            </h3>
            <p>
              If you discover a security vulnerability, please report it
              responsibly to our security team at{" "}
              <span className="text-[#6C5DD3] font-semibold">
                soonlay.tech@gmail.com
              </span>
              . We take all reports seriously and aim to respond within 24
              hours.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
