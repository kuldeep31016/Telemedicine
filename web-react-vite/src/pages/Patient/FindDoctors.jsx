import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp,
  X
} from 'lucide-react';
import { patientAPI } from '../../api';
import DoctorCard from './components/DoctorCard';
import SearchBar from './components/SearchBar';
import FilterDrawer from './components/FilterDrawer';
import DoctorProfileModal from './components/DoctorProfileModal';
import BookingModal from './components/BookingModal';
import toast from 'react-hot-toast';

const FindDoctors = () => {
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Debounced API search when searchQuery or filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      // Build query params for API
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filters.specialization.length === 1) params.specialization = filters.specialization[0];
      if (filters.gender !== 'Any') params.gender = filters.gender;
      if (filters.rating === '4+ & above') params.minRating = 4;
      else if (filters.rating === '4.5+ & above') params.minRating = 4.5;
      else if (filters.rating === '3+ & above') params.minRating = 3;

      if (filters.experience === '0-5 years') { params.minExperience = 0; params.maxExperience = 5; }
      else if (filters.experience === '5-10 years') { params.minExperience = 5; params.maxExperience = 10; }
      else if (filters.experience === '10+ years') { params.minExperience = 10; }

      if (filters.fee === '₹0 - ₹500') { params.minFee = 0; params.maxFee = 500; }
      else if (filters.fee === '₹500 - ₹1000') { params.minFee = 500; params.maxFee = 1000; }
      else if (filters.fee === '₹1000+') { params.minFee = 1000; }

      console.log('[Dashboard] Fetching doctors with params:', params);
      const response = await patientAPI.getDoctors(params);
      let result = response.data || [];

      // Client-side filters for specialization (multi-select) and language
      if (filters.specialization.length > 1) {
        result = result.filter(doc => filters.specialization.includes(doc.specialization));
      }

      // Sort: available today first, then by rating, then by fee
      result.sort((a, b) => {
        const aAvail = (a.availability || '').toLowerCase().includes('now') || (a.availability || '').toLowerCase().includes('today') ? 0 : 1;
        const bAvail = (b.availability || '').toLowerCase().includes('now') || (b.availability || '').toLowerCase().includes('today') ? 0 : 1;
        if (aAvail !== bAvail) return aAvail - bAvail;
        const aRating = a.rating || 4.5;
        const bRating = b.rating || 4.5;
        if (aRating !== bRating) return bRating - aRating;
        return (a.hourlyRate || 500) - (b.hourlyRate || 500);
      });

      setDoctors(result);
      setFilteredDoctors(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setLoading(false);
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
    <div className="space-y-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default FindDoctors;
