import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onClearAll }) => {
    const specializations = [
        'General Physician', 'Cardiologist', 'Dermatologist', 'Gynecologist',
        'Pediatrician', 'Psychiatrist', 'Orthopedic', 'Neurologist', 'Dentist'
    ];

    const genders = ['Any', 'Male', 'Female'];
    const ratings = ['Any', '4.5+ & above', '4+ & above'];
    const availabilities = ['Available Now', 'Today', 'This Week'];
    const experiences = ['Any', '0-5 years', '5-10 years', '10+ years'];
    const fees = ['Any', '₹0 - ₹500', '₹500 - ₹1000', '₹1000+'];
    const languages = ['English', 'Hindi', 'Regional'];

    const handleMultiSelect = (category, value) => {
        const current = filters[category] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setFilters({ ...filters, [category]: updated });
    };

    const handleSingleSelect = (category, value) => {
        setFilters({ ...filters, [category]: value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Filters</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Refine Results</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            {/* Specialization */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialization</h3>
                                <div className="flex flex-wrap gap-2">
                                    {specializations.map(spec => (
                                        <button
                                            key={spec}
                                            onClick={() => handleMultiSelect('specialization', spec)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${(filters.specialization || []).includes(spec)
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Gender */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gender</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {genders.map(gender => (
                                        <button
                                            key={gender}
                                            onClick={() => handleSingleSelect('gender', gender)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${filters.gender === gender
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Rating */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {ratings.map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => handleSingleSelect('rating', rating)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${filters.rating === rating
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Availability */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {availabilities.map(avail => (
                                        <button
                                            key={avail}
                                            onClick={() => handleSingleSelect('availability', avail)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${filters.availability === avail
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {avail}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Experience */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {experiences.map(exp => (
                                        <button
                                            key={exp}
                                            onClick={() => handleSingleSelect('experience', exp)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${filters.experience === exp
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {exp}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Consultation Fee */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Fee</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {fees.map(fee => (
                                        <button
                                            key={fee}
                                            onClick={() => handleSingleSelect('fee', fee)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${filters.fee === fee
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                        >
                                            {fee}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                            <button
                                onClick={onClearAll}
                                className="flex-1 py-4 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-white transition-all active:scale-95"
                            >
                                <RotateCcw size={16} />
                                Clear
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterDrawer;
