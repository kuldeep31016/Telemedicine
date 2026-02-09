import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  // Wait until authentication is fully resolved
  if (loading) {
    return <Loading fullScreen />;
  }

  // User is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const roleRedirectMap = {
      admin: '/admin/dashboard',
      doctor: '/doctor/dashboard',
      patient: '/patient/dashboard',
      asha_worker: '/asha/dashboard',
    };

    return (
      <Navigate
        to={roleRedirectMap[user.role] || '/login'}
        replace
      />
    );
  }

  // Access granted
  return children;
};

export default ProtectedRoute;
