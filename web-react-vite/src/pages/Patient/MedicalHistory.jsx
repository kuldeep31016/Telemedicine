import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Stethoscope,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  Activity,
  Download,
  Eye
} from 'lucide-react';
import { patientAPI } from '../../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMedicalHistory({ limit: 100 });
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
      toast.error('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Analyzed',
        className: 'bg-green-100 text-green-700'
      },
      processing: {
        icon: <Clock className="w-4 h-4 animate-spin" />,
        text: 'Processing',
        className: 'bg-blue-100 text-blue-700'
      },
      failed: {
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Failed',
        className: 'bg-red-100 text-red-700'
      },
      pending: {
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending',
        className: 'bg-gray-100 text-gray-700'
      }
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading medical history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            Medical History
          </h1>
          <p className="text-gray-600 mt-2">
            Complete timeline of your medical reports and consultations
          </p>
        </motion.div>

        {/* Content */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Medical History Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Upload your first medical report to start tracking your health journey
            </p>
            <button
              onClick={() => navigate('/patient/medical-reports')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Upload Medical Report
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

              {/* Timeline Items */}
              <div className="space-y-8">
                {history.map((item, index) => (
                  <motion.div
                    key={item.report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 top-6 w-5 h-5 bg-white border-4 border-blue-500 rounded-full z-10" />

                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="ml-20 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Report Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-6 h-6 text-blue-600" />
                              <h3 className="text-xl font-bold text-gray-900">
                                {item.report.reportTitle}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(item.report.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusBadge(item.report.processingStatus).icon}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    getStatusBadge(item.report.processingStatus).className
                                  }`}
                                >
                                  {getStatusBadge(item.report.processingStatus).text}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              window.open(item.report.fileUrl, '_blank')
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Report"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        {/* Analysis Summary */}
                        {item.analysis && (
                          <div className="space-y-4">
                            {/* Primary Specialist */}
                            {item.analysis.primarySpecialist && (
                              <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Stethoscope className="w-5 h-5 text-blue-600" />
                                  <span className="font-semibold text-gray-900">
                                    Recommended Specialist
                                  </span>
                                </div>
                                <p className="text-blue-900 font-medium">
                                  {item.analysis.primarySpecialist}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{
                                        width: `${item.analysis.confidenceScore}%`
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-600">
                                    {item.analysis.confidenceScore}%
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Detected Keywords */}
                            {item.analysis.detectedKeywords?.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                  Detected Conditions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.analysis.detectedKeywords
                                    .slice(0, 8)
                                    .map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* User Action */}
                            {item.analysis.userAction?.doctorSelected && (
                              <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                  <User className="w-5 h-5 text-green-600 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-1">
                                      Doctor Consulted
                                    </p>
                                    {item.analysis.userAction.selectedDoctorId && (
                                      <div className="flex items-center gap-2">
                                        {item.analysis.userAction.selectedDoctorId
                                          .profileImage && (
                                          <img
                                            src={
                                              item.analysis.userAction
                                                .selectedDoctorId.profileImage
                                            }
                                            alt="Doctor"
                                            className="w-8 h-8 rounded-full object-cover"
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {
                                              item.analysis.userAction
                                                .selectedDoctorId.name
                                            }
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {
                                              item.analysis.userAction
                                                .selectedDoctorId.specialization
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {item.analysis.userAction.appointmentBooked && (
                                      <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Appointment Booked</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* View Full Analysis Button */}
                        <button
                          onClick={() => navigate('/patient/medical-reports')}
                          className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          View Full Analysis
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {history.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Stethoscope className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        history.filter(
                          (item) => item.analysis?.userAction?.appointmentBooked
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Analyzed Reports</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        history.filter(
                          (item) => item.report.processingStatus === 'completed'
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
