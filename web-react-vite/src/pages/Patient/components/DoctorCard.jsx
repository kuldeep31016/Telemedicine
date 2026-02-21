import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, User, Globe, MapPin, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCurrentLocation } from '../../../utils/location';

const DoctorCard = ({ doctor, onViewProfile, onBookAppointment }) => {
    const {
        name,
        specialization,
        rating = 4.5,
        experience = 0,
        hourlyRate = 500,
        languages = ['English', 'Hindi'],
        availability = 'Available Today',
        profileImage,
        hospitalName = 'City General Hospital',
        hospitalAddress,
        location,
        registrationNumber = 'MC/825421',
        createdAt
    } = doctor;

    const practicingSince = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    const yearsOfExperience = experience || (new Date().getFullYear() - practicingSince);

    const getAvailabilityStatus = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('now') || s.includes('today')) return { label: 'Available Today', color: 'text-green-600' };
        return { label: 'Next Available: Tomorrow', color: 'text-amber-600' };
    };

    const status = getAvailabilityStatus(availability);

    const handleNavigateToHospital = async () => {
        if (!location || !location.lat || !location.lng) {
            toast.error('Hospital location not available. Doctor needs to update their profile.');
            return;
        }

        try {
            // Get user's current location
            toast.loading('Getting your location...', { id: 'location' });
            const userLocation = await getCurrentLocation();
            toast.dismiss('location');
            
            // Open Google Maps with directions from user location to hospital
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${location.lat},${location.lng}&travelmode=driving`;
            window.open(url, '_blank');
            
            toast.success('Opening Google Maps navigation...');
        } catch (error) {
            toast.dismiss('location');
            toast.error(error.message || 'Unable to get your location. Please enable location access.');
        }
    };

    const imageUrl = profileImage
        ? profileImage.startsWith('http')
            ? profileImage
            : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}${profileImage}`
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-200/80 flex flex-col overflow-hidden"
        >
            {/* ── Top: Doctor Info ── */}
            <div className="p-5 pb-4 flex gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User size={36} strokeWidth={1.5} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Name / Specialty / Rating */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                        <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
                            Dr. {name?.replace(/^Dr\.?\s*/i, '')}
                        </h3>
                        {rating >= 4.5 && (
                            <span className="inline-flex items-center gap-1 px-2 py-[2px] bg-orange-50 border border-orange-200/60 text-orange-500 rounded text-[10px] font-semibold whitespace-nowrap mt-0.5">
                                <Star size={9} fill="currentColor" /> Top Rated
                            </span>
                        )}
                    </div>
                    <p className="text-[13px] font-semibold text-blue-600 leading-tight">{specialization}</p>
                    <button
                        onClick={handleNavigateToHospital}
                        className="text-xs text-gray-500 mt-0.5 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                        title="Click to navigate via Google Maps"
                    >
                        <Navigation size={12} className="group-hover:text-blue-600" />
                        <span className="underline decoration-dotted underline-offset-2">{hospitalName}</span>
                    </button>

                    <div className="flex items-center gap-1.5 mt-2">
                        <Star size={15} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-gray-800">{rating}</span>
                        <span className="text-xs text-gray-400 font-medium">(120+ reviews)</span>
                    </div>
                </div>
            </div>

            {/* ── Middle: Stats ── */}
            <div className="px-5 py-3 border-t border-gray-100 space-y-2.5">
                {/* Experience & Languages */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-gray-400" />
                        <span className="font-bold text-gray-700">{yearsOfExperience} Years</span>
                        <span className="text-gray-400">since {practicingSince}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {languages.slice(0, 2).map(lang => (
                            <span key={lang} className="flex items-center gap-1 text-gray-500">
                                <Globe size={11} className="text-gray-400" />
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Fee & Availability */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-blue-600 text-sm">₹</span>
                        <span className="text-[15px] font-bold text-gray-900">{hourlyRate}</span>
                    </div>
                    <span className={`text-xs font-semibold italic ${status.color}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* ── Bottom: Actions ── */}
            <div className="px-5 pt-3 pb-5 border-t border-gray-100 space-y-3">
                <div className="flex gap-3">
                    <button
                        onClick={() => onBookAppointment(doctor)}
                        className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                        Book Appointment
                    </button>
                    <button
                        onClick={() => onViewProfile(doctor)}
                        className="flex-1 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
