import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye,
  Search,
  Calendar,
  Activity,
  Pill,
  TestTube,
  Filter,
  Upload
} from 'lucide-react';

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data - replace with API calls
  const records = [
    {
      id: 1,
      title: 'Prescription - General Checkup',
      doctor: 'Dr. Rakhi Singh',
      date: 'April 20, 2026',
      type: 'prescription',
      size: '156 KB',
      fileUrl: '#'
    },
    {
      id: 2,
      title: 'Blood Test Report - Complete Blood Count',
      doctor: 'City Diagnostics Lab',
      date: 'April 15, 2026',
      type: 'lab-report',
      size: '342 KB',
      fileUrl: '#'
    },
    {
      id: 3,
      title: 'X-Ray Report - Chest',
      doctor: 'Medicare Imaging Center',
      date: 'April 10, 2026',
      type: 'imaging',
      size: '1.2 MB',
      fileUrl: '#'
    },
    {
      id: 4,
      title: 'Prescription - Antibiotics',
      doctor: 'Dr. Dhwani Bhanusali',
      date: 'April 5, 2026',
      type: 'prescription',
      size: '128 KB',
      fileUrl: '#'
    },
    {
      id: 5,
      title: 'ECG Report',
      doctor: 'Heart Care Center',
      date: 'March 28, 2026',
      type: 'lab-report',
      size: '245 KB',
      fileUrl: '#'
    },
    {
      id: 6,
      title: 'Medical History - Annual Checkup',
      doctor: 'Dr. Aditya Sharma',
      date: 'March 20, 2026',
      type: 'medical-history',
      size: '890 KB',
      fileUrl: '#'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Records', icon: FileText },
    { id: 'prescription', label: 'Prescriptions', icon: Pill },
    { id: 'lab-report', label: 'Lab Reports', icon: TestTube },
    { id: 'imaging', label: 'Imaging', icon: Activity },
    { id: 'medical-history', label: 'Medical History', icon: Calendar }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prescription':
        return <Pill className="w-5 h-5 text-purple-600" />;
      case 'lab-report':
        return <TestTube className="w-5 h-5 text-blue-600" />;
      case 'imaging':
        return <Activity className="w-5 h-5 text-green-600" />;
      case 'medical-history':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      'prescription': 'bg-purple-50 text-purple-700 border-purple-200',
      'lab-report': 'bg-blue-50 text-blue-700 border-blue-200',
      'imaging': 'bg-green-50 text-green-700 border-green-200',
      'medical-history': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return badges[type] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const filteredRecords = records.filter(record => {
    const matchesFilter = activeFilter === 'all' || record.type === activeFilter;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (recordId) => {
    console.log('Download record:', recordId);
    // Implement download logic
  };

  const handleView = (recordId) => {
    console.log('View record:', recordId);
    // Implement view logic
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Medical Records</h1>
          <p className="text-slate-500 font-medium">View and download your prescriptions, lab reports, and medical documents.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search records by title or doctor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Document Icon */}
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getTypeIcon(record.type)}
                </div>

                {/* Document Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{record.title}</h3>
                      <p className="text-sm text-slate-600 mb-1">{record.doctor}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{record.date}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500">{record.size}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTypeBadge(record.type)}`}>
                      {record.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(record.id)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(record.id)}
                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={28} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No records found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
