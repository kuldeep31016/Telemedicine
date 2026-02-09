import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Clock,
  User,
  Heart,
  Video,
  X,
  Plus,
  Bell,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { adminAPI, patientAPI } from '../../api';
import DoctorCard from './components/DoctorCard';
import SearchBar from './components/SearchBar';
import FilterDrawer from './components/FilterDrawer';
import DoctorProfileModal from './components/DoctorProfileModal';
import BookingModal from './components/BookingModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    specialization: [],
    gender: 'Any',
    rating: 'Any',
    availability: 'Any',
    experience: 'Any',
    fee: 'Any',
    language: []
  });

  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      hospital: 'CarePlus Hospital',
      date: 'Tue, Apr 25',
      time: '4:30 PM',
      type: 'Video Consultation',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchQuery, filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getDoctors();
      setDoctors(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        (doc.name || '').toLowerCase().includes(query) ||
        (doc.specialization || '').toLowerCase().includes(query) ||
        (doc.hospitalName || '').toLowerCase().includes(query)
      );
    }

    if (filters.specialization.length > 0) {
      result = result.filter(doc => filters.specialization.includes(doc.specialization));
    }

    if (filters.gender !== 'Any') {
      result = result.filter(doc => (doc.gender || '').toLowerCase() === filters.gender.toLowerCase());
    }

    if (filters.rating !== 'Any') {
      const minRating = filters.rating === '4+ & above' ? 4 : (filters.rating === '4.5+ & above' ? 4.5 : 3);
      result = result.filter(doc => (doc.rating || 4.5) >= minRating);
    }

    if (filters.experience !== 'Any') {
      if (filters.experience === '0-5 years') result = result.filter(doc => (doc.experience || 0) <= 5);
      else if (filters.experience === '5-10 years') result = result.filter(doc => (doc.experience || 0) > 5 && (doc.experience || 0) <= 10);
      else if (filters.experience === '10+ years') result = result.filter(doc => (doc.experience || 0) > 10);
    }

    if (filters.fee !== 'Any') {
      if (filters.fee === '₹0 - ₹500') result = result.filter(doc => (doc.hourlyRate || 0) <= 500);
      else if (filters.fee === '₹500 - ₹1000') result = result.filter(doc => (doc.hourlyRate || 0) > 500 && (doc.hourlyRate || 0) <= 1000);
      else if (filters.fee === '₹1000+') result = result.filter(doc => (doc.hourlyRate || 0) > 1000);
    }

    result.sort((a, b) => {
      const aAvail = (a.availability || '').toLowerCase().includes('now') || (a.availability || '').toLowerCase().includes('today') ? 0 : 1;
      const bAvail = (b.availability || '').toLowerCase().includes('now') || (b.availability || '').toLowerCase().includes('today') ? 0 : 1;
      if (aAvail !== bAvail) return aAvail - bAvail;

      const aRating = a.rating || 4.5;
      const bRating = b.rating || 4.5;
      if (aRating !== bRating) return bRating - aRating;

      return (a.hourlyRate || 500) - (b.hourlyRate || 500);
    });

    setFilteredDoctors(result);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleBookAppointment = async (bookingData) => {
    try {
      const payload = {
        doctorId: selectedDoctor._id,
        ...bookingData,
        fee: selectedDoctor.hourlyRate || 500
      };
      console.log('Booking Appointment:', payload);
      // await patientAPI.bookAppointment(payload);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    }
  };

  const clearAllFilters = () => {
    setFilters({
      specialization: [],
      gender: 'Any',
      rating: 'Any',
      availability: 'Any',
      experience: 'Any',
      fee: 'Any',
      language: []
    });
    setSearchQuery('');
  };

  const removeFilter = (key, value) => {
    if (Array.isArray(filters[key])) {
      setFilters({ ...filters, [key]: filters[key].filter(v => v !== value) });
    } else {
      setFilters({ ...filters, [key]: 'Any' });
    }
  };

  const getAppliedFilters = () => {
    const chips = [];
    if (filters.specialization.length > 0) filters.specialization.forEach(s => chips.push({ key: 'specialization', label: s }));
    if (filters.gender !== 'Any') chips.push({ key: 'gender', label: filters.gender });
    if (filters.rating !== 'Any') chips.push({ key: 'rating', label: filters.rating });
    if (filters.availability !== 'Any') chips.push({ key: 'availability', label: filters.availability });
    if (filters.experience !== 'Any') chips.push({ key: 'experience', label: filters.experience });
    if (filters.fee !== 'Any') chips.push({ key: 'fee', label: filters.fee });
    return chips;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Heart className="text-white w-5 h-5" fill="white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">Doctify</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Welcome Back</p>
                  <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Patient'} 👋</p>
               </div>
               <div className="group relative">
                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden cursor-pointer">
                    {user?.profileImage ? (
                      <img src={user.profileImage} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-600">{user?.name?.charAt(0)}</span>
                    )}
                 </div>
                 {/* Simple Dropdown on hover/click would go here */}
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 group-hover:opacity-100 transition-all invisible group-hover:visible translate-y-2 group-hover:translate-y-0">
                    <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors">
                      <LogOut size={16} />
                      Logout
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Left Column: Doctor Discovery */}
        <div className="flex-1 space-y-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">Find Your Doctor</h1>
            <p className="text-slate-500 font-medium">Book appointments with leading specialists near you</p>
          </div>

          <div className="space-y-6">
            <SearchBar 
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              onOpenFilters={() => setIsFilterOpen(true)}
              filterCount={getAppliedFilters().length}
            />

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <AnimatePresence>
                {getAppliedFilters().map((chip, i) => (
                  <motion.div
                    key={`${chip.key}-${chip.label}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100"
                  >
                    {chip.label}
                    <button onClick={() => removeFilter(chip.key, chip.label)} className="hover:bg-blue-100 rounded p-0.5">
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
                {getAppliedFilters().length > 0 && (
                  <button onClick={clearAllFilters} className="text-xs font-bold text-slate-400 hover:text-blue-600 ml-2">
                    Clear All
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Doctor List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-black text-slate-900">Recommended Doctors</h2>
                <span className="text-xs font-bold text-slate-400 ml-2">{filteredDoctors.length} found</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-[24px] p-6 h-64 border border-slate-100 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-50" />
                      <div className="flex-1 space-y-2 mt-2">
                        <div className="h-4 w-1/3 bg-slate-50 rounded" />
                        <div className="h-3 w-1/4 bg-slate-50 rounded" />
                      </div>
                    </div>
                    <div className="space-y-3 mt-8">
                       <div className="h-10 bg-slate-50 rounded-xl" />
                       <div className="h-10 bg-slate-50 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {filteredDoctors.map(doctor => (
                   <DoctorCard 
                     key={doctor._id} 
                     doctor={doctor} 
                     onViewProfile={(doc) => {
                       setSelectedDoctor(doc);
                       setIsProfileOpen(true);
                     }}
                     onBookAppointment={(doc) => {
                       setSelectedDoctor(doc);
                       setIsBookingOpen(true);
                     }}
                   />
                 ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={24} className="text-slate-300" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-1">No doctors found</h3>
                 <p className="text-slate-500 font-medium">Try adjusting your filters to find more results</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Upcoming Appointment Widget */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black text-slate-900">Upcoming Appointments</h3>
               <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase">{upcomingAppointments.length} found</span>
            </div>

            <div className="space-y-4">
               {upcomingAppointments.map((app) => (
                 <div key={app.id} className="p-4 bg-slate-50/50 rounded-[24px] border border-slate-50 space-y-4">
                    <div className="flex gap-3">
                       <img src={app.image} className="w-12 h-12 rounded-xl object-cover" />
                       <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{app.doctorName}</p>
                          <p className="text-[11px] font-bold text-blue-600 mb-0.5">{app.specialty}</p>
                          <p className="text-[10px] font-medium text-slate-400">{app.hospital}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {app.date}, {app.time}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Video size={14} className="text-slate-400" />
                          {app.type}
                       </div>
                    </div>

                    <button className="w-full py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95">
                       <Video size={14} />
                       Join Video Call
                    </button>
                 </div>
               ))}
            </div>
          </div>

          {/* Emergency Alert Card */}
          <div className="bg-red-50 rounded-[32px] p-6 border border-red-100 space-y-4 overflow-hidden relative group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-3xl group-hover:bg-red-200 transition-colors"></div>
             <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 relative z-10">
                <AlertCircle size={24} />
             </div>
             <div className="relative z-10">
                <h4 className="text-lg font-black text-red-900">Emergency SOS</h4>
                <p className="text-xs font-bold text-red-600">Instant connection to nearest ambulance and emergency services</p>
             </div>
             <button className="w-full py-4 bg-red-500 text-white text-sm font-black rounded-xl flex items-center justify-center gap-2 relative z-10 hover:bg-red-600 transition-all active:scale-95">
                Call Now
             </button>
          </div>
        </aside>
      </main>

      {/* Floating SOS for mobile or quick access */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden z-50 border-4 border-white"
      >
        <AlertCircle size={32} />
      </motion.button>

      {/* Modals & Drawer */}
      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onClearAll={clearAllFilters}
      />

      <DoctorProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        doctor={selectedDoctor}
        onBookNow={(doc) => {
          setIsProfileOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctor}
        onConfirm={handleBookAppointment}
      />
    </div>
  );
};

export default PatientDashboard;
