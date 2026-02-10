import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('[PublicRoute] User state:', user);
  }, [user]);

  if (loading) {
    return null;
  }

  // If user is logged in → redirect to dashboard
  if (user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'patient':
        return <Navigate to="/patient/dashboard" replace />;
      case 'asha_worker':
        return <Navigate to="/asha/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // 🔑 IMPORTANT FIX:
  // If user is logged out and still on auth pages → go to landing page
 

  return children;
};

export default PublicRoute;
