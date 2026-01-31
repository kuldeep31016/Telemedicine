import React from 'react';
import { Users, Stethoscope, Calendar, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const AdminDashboard = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/doctors', label: 'Doctors', icon: <Stethoscope className="w-5 h-5" /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    { path: '/admin/sos-alerts', label: 'SOS Alerts', icon: <AlertCircle className="w-5 h-5" />, badge: '3' },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: <Users className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Doctors', value: '89', change: '+5%', icon: <Stethoscope className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Appointments Today', value: '156', change: '+8%', icon: <Calendar className="w-8 h-8" />, color: 'from-green-500 to-teal-500' },
    { label: 'SOS Alerts', value: '3', change: '-2%', icon: <AlertCircle className="w-8 h-8" />, color: 'from-red-500 to-orange-500' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'patient', status: 'active', joined: '2 hours ago' },
    { id: 2, name: 'Dr. Sarah Smith', email: 'sarah@example.com', role: 'doctor', status: 'active', joined: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'patient', status: 'active', joined: '1 day ago' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-semibold">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.role === 'doctor' ? 'info' : 'success'}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SOS Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Active SOS Alerts</h2>
              <Badge variant="danger">3 Active</Badge>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((alert) => (
                <div key={alert} className="p-3 glass rounded-lg border-l-4 border-red-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Emergency Alert #{alert}</p>
                      <p className="text-sm text-gray-600 mt-1">Patient: Emergency User {alert}</p>
                      <p className="text-xs text-gray-500 mt-1">Location: Latitude 28.XX, Longitude 77.XX</p>
                    </div>
                    <Badge variant="danger">URGENT</Badge>
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    View Details →
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

export default AdminDashboard;
