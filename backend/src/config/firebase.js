const admin = require('firebase-admin');
const config = require('./env');
const logger = require('./logger');
    
try {
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      })
    });
    logger.info('Firebase Admin initialized successfully');
  } else {
    logger.warn('Firebase Admin credentials missing. Skipping initialization.');
  }
} catch (error) {
  logger.error('Firebase Admin initialization failed:', error);
  // Do not throw, allowing server to start for development
}

module.exports = admin;
