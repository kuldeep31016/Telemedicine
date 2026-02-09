import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CreditCard, User, ShieldCheck, Globe, Calendar, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor, onViewProfile, onBookAppointment }) => {
    const {
        name,
        specialization,
        rating = 4.8,
        experience = 8,
        hourlyRate = 500,
        languages = ['English', 'Hindi'],
        availability = 'Available Today',
        profileImage,
        hospitalName = 'CarePlus Hospital',
        registrationNumber = 'PN/825421',
        createdAt
    } = doctor;

    const practicingSince = createdAt ? new Date(createdAt).getFullYear() : 2018;

    const getAvailabilityStatus = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('now') || s.includes('today')) return { label: 'Available Today', color: 'text-green-600', dot: 'bg-green-500' };
        return { label: 'Next Available: Tomorrow', color: 'text-amber-600', dot: 'bg-amber-500' };
    };

    const status = getAvailabilityStatus(availability);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md hover:border-blue-100"
        >
            {/* Top Section: Basic Info */}
            <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                        {profileImage ? (
                            <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User size={32} />
                            </div>
                        )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${status.dot}`} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-bold text-slate-900 truncate">{name}</h3>
                        {rating >= 4.5 && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold">
                                <Star size={10} fill="currentColor" />
                                Top Rated
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-semibold text-blue-600 mb-0.5">{specialization}</p>
                    <p className="text-xs text-slate-500 font-medium mb-2">{hospitalName}</p>

                    <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-700">{rating}</span>
                        <span className="text-xs text-slate-400">(120+ reviews)</span>
                    </div>
                </div>
            </div>

            {/* Stats Section: Clinical Labels */}
            <div className="grid grid-cols-1 gap-2 border-t border-slate-50 pt-4">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        <span className="font-bold">{experience} Years</span>
                        <span className="text-slate-400 font-medium">since {practicingSince}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {languages.slice(0, 2).map(lang => (
                            <span key={lang} className="flex items-center gap-1 text-slate-500 font-medium">
                                <Globe size={12} className="text-slate-300" />
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm mt-1">
                    <div className="flex items-center gap-2 text-slate-900 font-black">
                        <span className="text-blue-500">₹</span>
                        {hourlyRate}
                    </div>
                    <div className={`text-[11px] font-bold ${status.color}`}>
                        {status.label}
                    </div>
                </div>
            </div>

            {/* Credibility Footer */}
            <div className="bg-slate-50/50 -mx-6 px-6 py-2 border-y border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 tracking-tight">Reg. Number: {registrationNumber}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => onBookAppointment(doctor)}
                    className="flex-1 py-3 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                >
                    Book Appointment
                </button>
                <button
                    onClick={() => onViewProfile(doctor)}
                    className="px-5 py-3 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                    View Profile
                </button>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
