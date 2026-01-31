const AuditLog = require('../models/AuditLog');
const rateLimit = require('express-rate-limit');

// Create audit log for sensitive operations
const createAuditLog = async (req, action, resourceType, resourceId, severity = 'LOW') => {
  try {
    await AuditLog.create({
      userId: req.user._id,
      userType: req.user.role,
      action,
      resourceType,
      resourceId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      details: `${action} performed on ${resourceType}`,
      severity
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

// Middleware to log patient data access
const logPatientAccess = (action) => {
  return async (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode < 400 && req.params.patientId) {
        createAuditLog(req, action, 'patient', req.params.patientId, 'MEDIUM');
      }
    });
    next();
  };
};

// Enhanced rate limiting for sensitive endpoints
const sensitiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many sensitive requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP Whitelist middleware for admin actions
const adminIPWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (req.user.role === 'admin' && allowedIPs.length > 0) {
    if (!allowedIPs.includes(clientIP)) {
      createAuditLog(req, 'UNAUTHORIZED_ACCESS', 'admin', req.user._id, 'CRITICAL');
      return res.status(403).json({ 
        error: 'Access denied from this IP address' 
      });
    }
  }
  next();
};

// Data sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        obj[key] = obj[key].replace(/javascript:/gi, '');
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };
  
  sanitize(req.body);
  sanitize(req.query);
  next();
};

module.exports = {
  createAuditLog,
  logPatientAccess,
  sensitiveRateLimit,
  adminIPWhitelist,
  sanitizeInput
};