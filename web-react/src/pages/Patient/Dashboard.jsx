import React from 'react';
import { Calendar, FileText, Video, Activity, Heart, Pill } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const PatientDashboard = () => {
  const menuItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
    { path: '/patient/appointments', label: 'My Appointments', icon: <Calendar className="w-5 h-5" /> },
    { path: '/patient/doctors', label: 'Find Doctors', icon: <Video className="w-5 h-5" /> },
    { path: '/patient/records', label: 'Health Records', icon: <FileText className="w-5 h-5" /> },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: <Pill className="w-5 h-5" /> },
  ];

  const stats = [
    { label: 'Upcoming Appointments', value: '3', icon: <Calendar className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Health Records', value: '12', icon: <FileText className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Consultations', value: '8', icon: <Video className="w-8 h-8" />, color: 'from-green-500 to-teal-500' },
    { label: 'Prescriptions', value: '5', icon: <Pill className="w-8 h-8" />, color: 'from-orange-500 to-red-500' },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'General Physician', date: 'Today', time: '3:00 PM', type: 'Video Call' },
    { id: 2, doctor: 'Dr. John Doe', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM', type: 'In-Person' },
  ];

  const recentPrescriptions = [
    { id: 1, medicine: 'Paracetamol 500mg', doctor: 'Dr. Sarah Smith', date: '2 days ago', duration: '5 days' },
    { id: 2, medicine: 'Amoxicillin 250mg', doctor: 'Dr. John Doe', date: '1 week ago', duration: '7 days' },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: <Heart className="w-5 h-5" /> },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: <Activity className="w-5 h-5" /> },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Patient Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your health and appointments</p>
          </div>
          <Button variant="primary" icon={<Video className="w-5 h-5" />}>
            Book Appointment
          </Button>
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                <Badge variant="info">{upcomingAppointments.length} Scheduled</Badge>
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 glass rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.doctor.split(' ')[1].charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{appointment.doctor}</p>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="info">{appointment.type}</Badge>
                            <Badge variant="success">{appointment.date}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">{appointment.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" className="flex-1">
                        Join Call
                      </Button>
                      <Button variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Prescriptions */}
            <Card className="mt-6">
              <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>
              <div className="space-y-3">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-3 glass rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{prescription.medicine}</p>
                        <p className="text-sm text-gray-600">Prescribed by {prescription.doctor}</p>
                        <p className="text-xs text-gray-500 mt-1">Duration: {prescription.duration}</p>
                      </div>
                      <Badge variant="success">{prescription.date}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Health Metrics */}
          <div>
            <Card>
              <h2 className="text-xl font-bold mb-4">Health Metrics</h2>
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="p-4 glass rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {metric.icon}
                      </div>
                      <p className="font-semibold text-sm">{metric.label}</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-gray-600 mb-1">{metric.unit}</p>
                    </div>
                    <Badge variant="success" className="mt-2">Normal</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="primary" className="w-full">
                  Book Appointment
                </Button>
                <Button variant="secondary" className="w-full">
                  View Records
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
