import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  User,
  Clock,
  Send,
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';
import {
  Dashboard as DashboardIcon,
  CalendarMonth,
  People,
  VideoCall,
  Assignment,
  AttachMoney,
  Schedule,
  VerifiedUser
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { doctorAPI, prescriptionAPI } from '../../api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PrescriptionModal from './components/PrescriptionModal';

const DoctorPrescriptions = () => {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [sentPrescriptions, setSentPrescriptions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  // Menu items for sidebar
  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <CalendarMonth />, badge: stats?.todayAppointments || 0 },
    { path: '/doctor/patients', label: 'My Patients', icon: <People /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <VideoCall /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <Assignment /> },
    { path: '/doctor/earnings', label: 'Earnings', icon: <AttachMoney /> },
    { path: '/doctor/schedule', label: 'Schedule', icon: <Schedule /> },
    { path: '/doctor/profile', label: 'Profile', icon: <VerifiedUser /> },
  ];

  useEffect(() => {
    fetchPastAppointments();
    fetchSentPrescriptions();
  }, []);

  const fetchPastAppointments = async () => {
    try {
      const response = await doctorAPI.getMyAppointments({ status: 'completed', limit: 50 });
      if (response.success) {
        const appointments = response.data.appointments || [];
        setPastAppointments(appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSentPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getDoctorPrescriptions({ limit: 100 });
      if (response.success) {
        const prescriptions = response.data.prescriptions || [];
        const appointmentIds = new Set(prescriptions.map(p => p.appointmentId?._id || p.appointmentId));
        setSentPrescriptions(appointmentIds);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleSendPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionSuccess = () => {
    fetchPastAppointments();
    fetchSentPrescriptions();
  };

  const isPrescriptionSent = (appointmentId) => {
    return sentPrescriptions.has(appointmentId);
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Prescriptions
        </h1>
        <p className="text-gray-600 mt-2">
          Send prescriptions to patients from completed consultations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Past Consultations</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{pastAppointments.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Prescriptions Sent</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{sentPrescriptions.size}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {pastAppointments.length - sentPrescriptions.size}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {pastAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Completed Consultations</h3>
          <p className="text-gray-600">
            Complete consultations will appear here for prescription creation
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pastAppointments.map((appointment) => {
            const prescriptionSent = isPrescriptionSent(appointment._id);
            
            return (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${
                  prescriptionSent ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {appointment.patientId?.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.patientId?.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Consultation Date</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Time</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Type</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                            {appointment.consultationType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Status</p>
                          <div className="mt-1">
                            {prescriptionSent ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <CheckCircle className="w-3 h-3" />
                                Prescription Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {appointment.reasonForVisit && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 font-medium mb-1">Reason for Visit</p>
                          <p className="text-sm text-gray-700">{appointment.reasonForVisit}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSendPrescription(appointment)}
                      disabled={prescriptionSent}
                      className={`ml-4 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        prescriptionSent
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {prescriptionSent ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Prescription
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && selectedAppointment && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;
