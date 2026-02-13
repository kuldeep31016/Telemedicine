import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Globe, CreditCard, Award, Heart, MessageSquare, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const DoctorProfileModal = ({ isOpen, onClose, doctor, onBookNow }) => {
    if (!doctor) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Doctor Profile"
            size="md"
        >
            <div className="space-y-8 pb-4">
                {/* Header Profile Info */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-40 h-40 rounded-[32px] overflow-hidden bg-purple-50 shadow-inner flex-shrink-0">
                        {doctor.profileImage ? (
                            <img src={doctor.profileImage.startsWith('http') ? doctor.profileImage : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}${doctor.profileImage}`} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-200">
                                <Star size={64} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-black text-gray-900">{doctor.name}</h2>
                                <Badge label="Verified" icon={<ShieldCheck size={12} />} variant="success" />
                            </div>
                            <p className="text-xl font-bold text-[#6C5DD3]">{doctor.specialization}</p>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-gray-900">{doctor.rating || 4.5}</span>
                                <span className="text-gray-500">(120+ reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-gray-400" />
                                <span className="font-bold text-gray-900">{doctor.experience || 0} Years</span>
                                <span className="text-gray-500">Experience</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {(doctor.languages || ['English', 'Hindi']).map(lang => (
                                <span key={lang} className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100 flex items-center gap-2">
                                    <Globe size={12} />
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Consultation', value: `₹${doctor.hourlyRate || 500}`, icon: <CreditCard size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Satisfied Patients', value: '98%', icon: <Heart size={18} />, color: 'text-red-500', bg: 'bg-red-50' },
                        { label: 'Response Time', value: '15 min', icon: <Clock size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Qualifications', value: 'MBBS, MD', icon: <Award size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} p-4 rounded-2xl space-y-1 border border-white`}>
                            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">{stat.label}</p>
                            <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* About Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">About Doctor</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {doctor.about || `Dr. ${doctor.name} is a highly experienced ${doctor.specialization} with over ${doctor.experience || 0} years of practice. Dedicated to providing compassionate and comprehensive care to patients, specializing in advanced diagnostic and treatment methods.`}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => onBookNow(doctor)}
                        className="flex-1 py-4 bg-[#6C5DD3] text-white font-bold rounded-2xl hover:bg-[#5B4DB3] shadow-xl shadow-purple-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Book Appointment
                        <ChevronRight size={20} />
                    </button>
                    <button className="p-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                        <MessageSquare size={24} />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const Badge = ({ label, icon, variant = 'primary' }) => {
    const styles = {
        primary: 'bg-purple-50 text-purple-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
    };
    return (
        <span className={`px-3 py-1 ${styles[variant]} rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
            {icon}
            {label}
        </span>
    );
};

export default DoctorProfileModal;
