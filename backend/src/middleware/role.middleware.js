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

module.exports = { authorize, authorizeOwner };
