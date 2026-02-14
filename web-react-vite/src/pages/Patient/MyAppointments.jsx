import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Loader2
} from 'lucide-react';
import { patientAPI } from '../../api';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [tabCounts, setTabCounts] = useState({
    upcoming: 0,
    past: 0,
    cancelled: 0
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch all appointments at once
      const response = await patientAPI.getAppointments();
      const allAppointments = response.data?.appointments || [];
      
      console.log('Fetched appointments:', allAppointments);

      // Categorize appointments
      const now = new Date();
      const categorized = {
        upcoming: [],
        past: [],
        cancelled: []
      };

      allAppointments.forEach(apt => {
        const aptDate = new Date(apt.appointmentDate);
        
        if (apt.status === 'cancelled') {
          categorized.cancelled.push(transformAppointment(apt));
        } else if (apt.status === 'completed' || aptDate < now) {
          categorized.past.push(transformAppointment(apt, 'completed'));
        } else {
          categorized.upcoming.push(transformAppointment(apt));
        }
      });

      setAppointments(categorized);
      setTabCounts({
        upcoming: categorized.upcoming.length,
        past: categorized.past.length,
        cancelled: categorized.cancelled.length
      });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend appointment to UI format
  const transformAppointment = (apt, overrideStatus = null) => {
    const doctor = apt.doctorId || {};
    const date = new Date(apt.appointmentDate);
    
    // Format date as "Wed, April 26, 2026"
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get doctor profile image URL or placeholder
    const avatar = doctor.profileImage 
      ? (doctor.profileImage.startsWith('http') 
          ? doctor.profileImage 
          : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${doctor.profileImage}`)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=random`;

    return {
      id: apt._id,
      refNo: `APPT${apt._id.slice(-6).toUpperCase()}`,
      doctor: doctor.name || 'Unknown Doctor',
      specialization: doctor.specialization || 'General Physician',
      hospital: 'City General Hospital', // From mock - can be added to doctor model
      date: formattedDate,
      time: apt.appointmentTime,
      type: apt.consultationType === 'video' ? 'Video Consultation' : 'In-Person Appointment',
      rating: 4.5, // From mock - can be calculated from reviews
      reviews: '120+', // From mock - can be added to doctor model
      fee: apt.amount,
      avatar,
      status: overrideStatus || apt.status,
      paymentId: apt.paymentId,
      orderId: apt.orderId,
      cancelReason: apt.cancellationReason || null,
      badge: null // Can add based on doctor rating
    };
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
    { id: 'past', label: 'Past', count: tabCounts.past },
    { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled }
  ];

  const currentAppointments = appointments[activeTab] || [];

  const handleJoinReschedule = (appointmentId) => {
    console.log('Join/Reschedule:', appointmentId);
    toast.info('Join/Reschedule feature coming soon!');
    // TODO: Implement join/reschedule logic
  };

  const handleCancel = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    const reason = prompt('Please provide a reason for cancellation (optional):');
    
    try {
      toast.loading('Cancelling appointment...');
      await patientAPI.cancelAppointment(appointmentId, reason || 'Cancelled by patient');
      toast.dismiss();
      toast.success('Appointment cancelled successfully');
      
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      toast.dismiss();
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleDownloadInvoice = (appointmentId) => {
    console.log('Download invoice:', appointmentId);
    toast.info('Invoice download feature coming soon!');
    // TODO: Implement invoice download
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
        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading appointments...</p>
          </div>
        ) : (
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
                          Ref. No: {appointment.refNo}
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
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
