import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Landing Page
import LandingPage from './pages/LandingPage';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import DoctorLogin from './pages/Auth/DoctorLogin';
import PatientLogin from './pages/Auth/PatientLogin';

// Dashboard Pages
import AdminDashboard from './pages/Admin/Dashboard';
import DoctorsManagement from './pages/Admin/DoctorsManagement';
import DoctorProfile from './pages/Admin/DoctorProfile';
import PatientsManagement from './pages/Admin/PatientsManagement';
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorProfilePage from './pages/Doctor/Profile';
import PatientLayout from './pages/Patient/PatientLayout';
import DashboardOverview from './pages/Patient/DashboardOverview';
import FindDoctors from './pages/Patient/FindDoctors';
import MyAppointments from './pages/Patient/MyAppointments';
import MedicalRecords from './pages/Patient/MedicalRecords';
import BillsPayments from './pages/Patient/BillsPayments';
import MyDoctors from './pages/Patient/MyDoctors';
import Settings from './pages/Patient/Settings';

// Components
import Loading from './components/common/Loading';

function App() {
  const { initializeAuth, loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe && unsubscribe();
  }, [initializeAuth]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Landing Page */}
       
<Route path="/" element={
  <PublicRoute>
    <LandingPage />
  </PublicRoute>
} />

        {/* Public Auth Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/doctor/login" element={
          <PublicRoute>
            <DoctorLogin />
          </PublicRoute>
        } />
        <Route path="/patient/login" element={
          <PublicRoute>
            <PatientLogin />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes - Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DoctorsManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors/:doctorId" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DoctorProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin/patients" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PatientsManagement />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Doctor */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorProfilePage />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Patient */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="find-doctors" element={<FindDoctors />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="bills-payments" element={<BillsPayments />} />
          <Route path="my-doctors" element={<MyDoctors />} />
          <Route path="settings" element={<Settings />} />
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
