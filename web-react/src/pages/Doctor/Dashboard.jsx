import React from 'react';
import { Calendar, Users, Video, FileText, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const DoctorDashboard = () => {
  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <Calendar className="w-5 h-5" /> },
    { path: '/doctor/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" />, badge: '5' },
    { path: '/doctor/patients', label: 'My Patients', icon: <Users className="w-5 h-5" /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <Video className="w-5 h-5" /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <FileText className="w-5 h-5" /> },
  ];

  const stats = [
    { label: 'Today\'s Appointments', value: '8', icon: <Calendar className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Patients', value: '234', icon: <Users className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Consultations', value: '12', icon: <Video className="w-8 h-8" />, color: 'from-green-500 to-teal-500' },
    { label: 'Prescriptions', value: '45', icon: <FileText className="w-8 h-8" />, color: 'from-orange-500 to-red-500' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Video Call', status: 'upcoming' },
    { id: 2, patient: 'Jane Smith', time: '11:30 AM', type: 'In-Person', status: 'upcoming' },
    { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Video Call', status: 'upcoming' },
  ];

  const recentPatients = [
    { id: 1, name: 'Alice Brown', lastVisit: '2 days ago', condition: 'Fever', status: 'treated' },
    { id: 2, name: 'Bob Wilson', lastVisit: '1 week ago', condition: 'Headache', status: 'follow-up' },
    { id: 3, name: 'Carol Davis', lastVisit: '3 days ago', condition: 'Cough', status: 'treated' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your appointments and consultations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Today's Appointments</h2>
              <Badge variant="info">{upcomingAppointments.length} Scheduled</Badge>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 glass rounded-lg hover:bg-white/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{appointment.patient}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{appointment.time}</span>
                        </div>
                        <Badge variant="info" className="mt-2">{appointment.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Start Call
                    </button>
                    <button className="px-4 py-2 glass rounded-lg font-semibold hover:bg-white/50 transition-all">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Patients */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Recent Patients</h2>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="p-3 glass rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={patient.status === 'treated' ? 'success' : 'warning'}>
                        {patient.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{patient.lastVisit}</p>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    View Records →
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
