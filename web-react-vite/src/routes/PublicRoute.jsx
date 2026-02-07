import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    console.log('[PublicRoute] User state:', user);
  }, [user]);

  // Show nothing while loading to avoid flash
  if (loading) {
    return null;
  }

  if (user) {
    // Redirect to appropriate dashboard if already logged in
    console.log('[PublicRoute] User is authenticated, redirecting to dashboard for role:', user.role);
    switch (user.role) {
      case 'admin':
        console.log('[PublicRoute] Redirecting to admin dashboard');
        return <Navigate to="/admin/dashboard" replace />;
      case 'doctor':
        console.log('[PublicRoute] Redirecting to doctor dashboard');
        return <Navigate to="/doctor/dashboard" replace />;
      case 'patient':
        console.log('[PublicRoute] Redirecting to patient dashboard');
        return <Navigate to="/patient/dashboard" replace />;
      case 'asha_worker':
        console.log('[PublicRoute] Redirecting to asha dashboard');
        return <Navigate to="/asha/dashboard" replace />;
      default:
        console.log('[PublicRoute] Unknown role, redirecting to home');
        return <Navigate to="/" replace />;
    }
  }

  console.log('[PublicRoute] No user, showing public content');
  return children;
};

export default PublicRoute;
