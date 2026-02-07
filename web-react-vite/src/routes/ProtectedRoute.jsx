import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, firebaseUser, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('[ProtectedRoute] Auth state:', { 
      user, 
      firebaseUser: firebaseUser?.uid, 
      loading, 
      allowedRoles,
      currentPath: location.pathname 
    });
  }, [user, firebaseUser, loading, allowedRoles, location]);

  // Show loading only during initial auth check
  if (loading) {
    console.log('[ProtectedRoute] Loading auth state...');
    return <Loading fullScreen />;
  }

  // No authenticated user - redirect to login
  if (!firebaseUser || !user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('[ProtectedRoute] User role not allowed. User role:', user.role, 'Allowed:', allowedRoles);
    // Redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case 'admin':
        console.log('[ProtectedRoute] Redirecting to admin dashboard');
        return <Navigate to="/admin/dashboard" replace />;
      case 'doctor':
        console.log('[ProtectedRoute] Redirecting to doctor dashboard');
        return <Navigate to="/doctor/dashboard" replace />;
      case 'patient':
        console.log('[ProtectedRoute] Redirecting to patient dashboard');
        return <Navigate to="/patient/dashboard" replace />;
      case 'asha_worker':
        console.log('[ProtectedRoute] Redirecting to asha dashboard');
        return <Navigate to="/asha/dashboard" replace />;
      default:
        console.log('[ProtectedRoute] Unknown role, redirecting to login');
        return <Navigate to="/login" replace />;
    }
  }

  console.log('[ProtectedRoute] Access granted, showing protected content');
  return children;
};

export default ProtectedRoute;
