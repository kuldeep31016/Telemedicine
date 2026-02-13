const { ForbiddenError, UnauthorizedError } = require('../utils/error.util');

// Role-based authorization middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
    }
    
    next();
  };
};

// Check if user is a doctor
const isDoctor = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  
  if (req.user.role !== 'doctor') {
    return next(new ForbiddenError('Access denied. Doctor role required'));
  }
  
  next();
};

// Check if user is a patient
const isPatient = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  
  if (req.user.role !== 'patient') {
    return next(new ForbiddenError('Access denied. Patient role required'));
  }
  
  next();
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  
  if (req.user.role !== 'admin') {
    return next(new ForbiddenError('Access denied. Admin role required'));
  }
  
  next();
};

// Check if user owns the resource
const authorizeOwner = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError('You can only access your own resources'));
    }
    
    next();
  };
};

module.exports = { authorize, authorizeOwner, isDoctor, isPatient, isAdmin };
