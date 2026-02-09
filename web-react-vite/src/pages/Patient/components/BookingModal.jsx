import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Phone, MessageSquare, ChevronRight, Check } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const BookingModal = ({ isOpen, onClose, doctor, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        type: 'Video'
    });

    if (!doctor) return null;

    const dates = [
        { day: 'Mon', date: 'Feb 10' },
        { day: 'Tue', date: 'Feb 11' },
        { day: 'Wed', date: 'Feb 12' },
        { day: 'Thu', date: 'Feb 13' },
        { day: 'Fri', date: 'Feb 14' }
    ];

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const consultTypes = [
        { id: 'Video', icon: <Video size={20} />, label: 'Video Call', desc: 'Secure high-quality video call' },
        { id: 'Audio', icon: <Phone size={20} />, label: 'Audio Call', desc: 'Speak directly with doctor' },
        { id: 'Chat', icon: <MessageSquare size={20} />, label: 'Live Chat', desc: 'Message for quick queries' }
    ];

    const handleConfirm = () => {
        onConfirm(bookingData);
        setStep(3); // Show success
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setStep(1);
            }}
            title={step === 3 ? "Booking Confirmed" : "Book Your Appointment"}
            size="sm"
        >
            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-8">
                        {/* Select Date */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Select Date</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {dates.map((d, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setBookingData({ ...bookingData, date: `${d.day}, ${d.date}` })}
                                        className={`flex-shrink-0 w-20 py-4 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${bookingData.date === `${d.day}, ${d.date}`
                                                ? 'bg-[#6C5DD3] border-[#6C5DD3] text-white shadow-lg shadow-purple-100'
                                                : 'bg-white border-gray-100 text-gray-700 hover:border-purple-200'
                                            }`}
                                    >
                                        <span className="text-[10px] uppercase font-black opacity-60">{d.day}</span>
                                        <span className="text-sm font-bold">{d.date.split(' ')[1]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Select Time */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Select Time Slot</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {timeSlots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setBookingData({ ...bookingData, time: slot })}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${bookingData.time === slot
                                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                                : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={!bookingData.date || !bookingData.time}
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-[#6C5DD3] text-white font-bold rounded-2xl hover:bg-[#5B4DB3] shadow-lg shadow-purple-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            Next Step
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Consultation Type</h3>
                            <div className="space-y-3">
                                {consultTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setBookingData({ ...bookingData, type: type.id })}
                                        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${bookingData.type === type.id
                                                ? 'border-[#6C5DD3] bg-purple-50 shadow-sm'
                                                : 'border-gray-100 hover:border-purple-100'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bookingData.type === type.id ? 'bg-[#6C5DD3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {type.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{type.label}</p>
                                            <p className="text-xs text-gray-500">{type.desc}</p>
                                        </div>
                                        {bookingData.type === type.id && <Check className="ml-auto text-[#6C5DD3]" size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-[24px] space-y-3 border border-gray-100">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Consultation Fee</span>
                                <span className="text-gray-900">₹{doctor.hourlyRate || 500}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Slot</span>
                                <span className="text-gray-900">{bookingData.date} @ {bookingData.time}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50">
                                Back
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-[2] py-4 bg-[#6C5DD3] text-white font-bold rounded-2xl hover:bg-[#5B4DB3] shadow-lg shadow-purple-100 transition-all"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="py-10 text-center space-y-6">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Check size={48} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Success!</h3>
                            <p className="text-gray-500">Your appointment with <span className="font-bold text-gray-900">{doctor.name}</span> has been scheduled successfully.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 text-left space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</p>
                                    <p className="font-bold text-gray-900">{bookingData.date} @ {bookingData.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                    {consultTypes.find(t => t.id === bookingData.type)?.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</p>
                                    <p className="font-bold text-gray-900">{bookingData.type} Consultation</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default BookingModal;
