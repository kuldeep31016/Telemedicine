import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Star,
  Download,
  X,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data - replace with API calls
  const appointments = {
    upcoming: [
      {
        id: 'APPT123456',
        doctor: 'Dr. Dhwani Bhanusali',
        specialization: 'Nephrologist',
        hospital: 'City General Hospital',
        date: 'Wed, April 26, 2026',
        time: '10:30 AM',
        type: 'In-Person Appointment',
        rating: 4.5,
        reviews: '120+',
        fee: 500,
        avatar: 'https://i.pravatar.cc/150?img=5',
        status: 'confirmed',
        badge: 'Top Rated'
      },
      {
        id: 'APPT123457',
        doctor: 'Dr. Rakhi Singh',
        specialization: 'Gynecologist',
        hospital: 'City General Hospital',
        date: 'Fri, April 28, 2026',
        time: '12:00 PM',
        type: 'In-Person Appointment',
        rating: 4.5,
        reviews: '120+',
        fee: 500,
        avatar: 'https://i.pravatar.cc/150?img=10',
        status: 'confirmed',
        badge: 'Top Rated'
      }
    ],
    past: [
      {
        id: 'APPT123450',
        doctor: 'Dr. Aditya Sharma',
        specialization: 'Cardiologist',
        hospital: 'Medicare Center',
        date: 'Mon, April 10, 2026',
        time: '2:00 PM',
        type: 'Video Consultation',
        rating: 4.8,
        reviews: '200+',
        fee: 800,
        avatar: 'https://i.pravatar.cc/150?img=12',
        status: 'completed'
      },
      {
        id: 'APPT123451',
        doctor: 'Dr. Priya Patel',
        specialization: 'Dermatologist',
        hospital: 'Skin Care Clinic',
        date: 'Wed, April 5, 2026',
        time: '11:00 AM',
        type: 'In-Person Appointment',
        rating: 4.6,
        reviews: '150+',
        fee: 600,
        avatar: 'https://i.pravatar.cc/150?img=9',
        status: 'completed'
      }
    ],
    cancelled: [
      {
        id: 'APPT123449',
        doctor: 'Dr. Rajesh Kumar',
        specialization: 'Orthopedic',
        hospital: 'Bone & Joint Clinic',
        date: 'Fri, April 15, 2026',
        time: '3:00 PM',
        type: 'In-Person Appointment',
        rating: 4.3,
        reviews: '90+',
        fee: 700,
        avatar: 'https://i.pravatar.cc/150?img=8',
        status: 'cancelled',
        cancelReason: 'Cancelled by patient'
      }
    ]
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: appointments.upcoming.length },
    { id: 'past', label: 'Past', count: appointments.past.length },
    { id: 'cancelled', label: 'Cancelled', count: appointments.cancelled.length }
  ];

  const currentAppointments = appointments[activeTab] || [];

  const handleJoinReschedule = (appointmentId) => {
    console.log('Join/Reschedule:', appointmentId);
    // Implement join/reschedule logic
  };

  const handleCancel = (appointmentId) => {
    console.log('Cancel appointment:', appointmentId);
    // Implement cancel logic
  };

  const handleDownloadInvoice = (appointmentId) => {
    console.log('Download invoice:', appointmentId);
    // Implement download logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Appointments</h1>
        <p className="text-slate-500 font-medium">Track and manage your doctor appointments here.</p>
      </div>

      {/* Tabs & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Filters
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar */}
                  <img 
                    src={appointment.avatar} 
                    alt={appointment.doctor}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100"
                  />

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-slate-900">{appointment.doctor}</h3>
                          {appointment.badge && (
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md">
                              ⭐ {appointment.badge}
                            </span>
                          )}
                          {activeTab !== 'upcoming' && (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-blue-600 font-semibold text-sm mb-1">{appointment.specialization}</p>
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.hospital}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                        Ref. No: {appointment.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Date</p>
                          <p className="text-sm font-bold text-slate-900">{appointment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Time</p>
                          <p className="text-sm font-bold text-slate-900">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Video className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Type</p>
                          <p className="text-sm font-bold text-slate-900">{appointment.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-slate-900">{appointment.rating}</span>
                          <span className="text-sm text-slate-500">({appointment.reviews} reviews)</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">₹ {appointment.fee}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        {activeTab === 'upcoming' && (
                          <>
                            <button 
                              onClick={() => handleJoinReschedule(appointment.id)}
                              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Join/Reschedule
                            </button>
                            <button 
                              onClick={() => handleCancel(appointment.id)}
                              className="px-6 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {activeTab === 'past' && (
                          <button 
                            onClick={() => handleDownloadInvoice(appointment.id)}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Invoice
                          </button>
                        )}
                        {activeTab === 'cancelled' && appointment.cancelReason && (
                          <span className="text-sm text-slate-500 italic">{appointment.cancelReason}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-20 text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={28} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No {activeTab} appointments</h3>
              <p className="text-slate-500 font-medium">You don't have any {activeTab} appointments at the moment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyAppointments;
