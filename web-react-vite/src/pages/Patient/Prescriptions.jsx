import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  User,
  Download,
  Eye,
  Loader,
  Pill,
  ClipboardList,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { prescriptionAPI } from '../../api';
import PrescriptionViewer from '../../components/PrescriptionViewer';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getPatientPrescriptions({ limit: 50 });
      if (response.success) {
        const fetchedPrescriptions = response.data.prescriptions || [];
        setPrescriptions(fetchedPrescriptions);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (prescription) => {
    try {
      const data = await prescriptionAPI.getPdfBlob(prescription._id);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing prescription:', error);
      toast.error('Failed to open prescription');
    }
  };

  const handleDownload = async () => {
    if (!selectedPrescription) return;

    try {
      // Record the download
      await prescriptionAPI.downloadPrescription(selectedPrescription._id);
      // Fetch PDF as blob through the proxy (with auth)
      const response = await prescriptionAPI.getPdfBlob(selectedPrescription._id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_${selectedPrescription._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Prescription downloaded');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast.error('Failed to download prescription');
    }
  };

  const handleQuickDownload = async (prescription) => {
    try {
      // Record the download
      await prescriptionAPI.downloadPrescription(prescription._id);
      // Fetch PDF as blob through the proxy (with auth)
      const response = await prescriptionAPI.getPdfBlob(prescription._id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_${prescription._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Prescription downloaded!');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast.error('Failed to download prescription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          My Prescriptions
        </h1>
        <p className="text-gray-600 mt-2">
          View and download your medical prescriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{prescriptions.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">This Month</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {prescriptions.filter(p => {
                  const prescDate = new Date(p.createdAt);
                  const now = new Date();
                  return prescDate.getMonth() === now.getMonth() && prescDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Verified</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{prescriptions.length}</p>
            </div>
            <Shield className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-600">
            Your prescriptions from doctors will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <motion.div
              key={prescription._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Prescription
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Verified
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span className="font-semibold">Dr. {prescription.doctorId?.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm">{prescription.doctorId?.specialization}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Pill className="w-4 h-4" />
                          <span>{prescription.medicines?.length || 0} Medicines</span>
                        </div>
                        {prescription.testsRecommended?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <ClipboardList className="w-4 h-4" />
                            <span>{prescription.testsRecommended.length} Tests</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleView(prescription)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleQuickDownload(prescription)}
                      className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Diagnosis Preview */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">DIAGNOSIS</p>
                  <p className="text-sm text-gray-800 line-clamp-2">{prescription.diagnosis}</p>
                </div>

                {/* Medicines Preview */}
                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prescription.medicines.slice(0, 3).map((medicine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
                      >
                        {medicine.name}
                      </span>
                    ))}
                    {prescription.medicines.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{prescription.medicines.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Follow-up Date */}
                {prescription.followUpDate && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-600 font-semibold mb-1">FOLLOW-UP REQUIRED</p>
                    <p className="text-sm text-gray-800">
                      Scheduled for: {new Date(prescription.followUpDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {isViewerOpen && selectedPrescription && (
        <PrescriptionViewer
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedPrescription(null);
          }}
          prescription={selectedPrescription}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default PatientPrescriptions;
