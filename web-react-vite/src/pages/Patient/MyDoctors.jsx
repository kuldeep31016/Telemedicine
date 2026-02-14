import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Star,
  MapPin,
  Calendar,
  Video,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyDoctors = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved');

  // Mock data - replace with API calls
  const doctors = {
    saved: [
      {
        id: 1,
        name: 'Dr. Dhwani Bhanusali',
        specialization: 'Nephrologist',
        hospital: 'City General Hospital',
        rating: 4.5,
        reviews: '120+',
        avatar: 'https://i.pravatar.cc/150?img=5',
        fee: 500,
        lastVisit: 'April 26, 2026'
      },
      {
        id: 2,
        name: 'Dr. Rakhi Singh',
        specialization: 'Gynecologist',
        hospital: 'City General Hospital',
        rating: 4.5,
        reviews: '120+',
        avatar: 'https://i.pravatar.cc/150?img=10',
        fee: 500,
        lastVisit: 'April 28, 2026'
      }
    ],
    recent: [
      {
        id: 3,
        name: 'Dr. Aditya Sharma',
        specialization: 'Cardiologist',
        hospital: 'Medicare Center',
        rating: 4.8,
        reviews: '200+',
        avatar: 'https://i.pravatar.cc/150?img=12',
        fee: 800,
        lastVisit: 'April 10, 2026'
      },
      {
        id: 4,
        name: 'Dr. Priya Patel',
        specialization: 'Dermatologist',
        hospital: 'Skin Care Clinic',
        rating: 4.6,
        reviews: '150+',
        avatar: 'https://i.pravatar.cc/150?img=9',
        fee: 600,
        lastVisit: 'April 5, 2026'
      }
    ]
  };

  const tabs = [
    { id: 'saved', label: 'Saved Doctors' },
    { id: 'recent', label: 'Recently Consulted' }
  ];

  const currentDoctors = doctors[activeTab] || [];

  const handleBookAppointment = (doctorId) => {
    console.log('Book appointment with doctor:', doctorId);
    navigate('/patient/find-doctors');
  };

  const handleRemoveFavorite = (doctorId) => {
    console.log('Remove from favorites:', doctorId);
    // Implement remove logic
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Doctors</h1>
        <p className="text-slate-500 font-medium">Your saved doctors and recently consulted specialists.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-fit">
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
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {doctors[tab.id].length}
            </span>
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Doctor Info */}
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={doctor.avatar} 
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900">{doctor.name}</h3>
                  {activeTab === 'saved' && (
                    <button
                      onClick={() => handleRemoveFavorite(doctor.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" fill="currentColor" />
                    </button>
                  )}
                </div>
                <p className="text-blue-600 font-semibold text-sm mb-1">{doctor.specialization}</p>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{doctor.hospital}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-slate-900">{doctor.rating}</span>
                </div>
                <p className="text-xs text-slate-500">{doctor.reviews} reviews</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-lg font-black text-slate-900 mb-1">₹{doctor.fee}</p>
                <p className="text-xs text-slate-500">Consultation</p>
              </div>
            </div>

            {/* Last Visit */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
              <Clock className="w-4 h-4" />
              <span>Last visit: {doctor.lastVisit}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBookAppointment(doctor.id)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book
              </button>
              <button
                className="px-4 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {currentDoctors.length === 0 && (
        <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={28} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No doctors yet</h3>
          <p className="text-slate-500 font-medium mb-6">
            {activeTab === 'saved' 
              ? 'Start saving your favorite doctors for quick access.' 
              : 'Doctors you consult will appear here.'}
          </p>
          <button
            onClick={() => navigate('/patient/find-doctors')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Find Doctors
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDoctors;
