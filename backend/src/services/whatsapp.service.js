const twilio = require('twilio');
const logger = require('../config/logger');
const config = require('../config/env');

// Initialize Twilio client
let twilioClient = null;

try {
  if (config.twilio.accountSid && config.twilio.authToken) {
    twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
    logger.info('Twilio WhatsApp client initialized successfully');
  } else {
    logger.warn('Twilio credentials not configured - WhatsApp notifications will be disabled');
  }
} catch (error) {
  logger.error('Failed to initialize Twilio client:', error);
}

/**
 * Format phone number to E.164 format for WhatsApp
 * @param {string} phoneNumber - Phone number in any format
 * @returns {string} - Formatted phone number (e.g., +919876543210)
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 91 (India) and has 10 digits after it
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // If it's a 10-digit number (assume India)
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already starts with country code
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  // Default: add +91 for India
  return `+91${cleaned}`;
};

/**
 * Send WhatsApp message for appointment confirmation
 * @param {Object} appointmentData - Appointment details
 * @param {Object} appointmentData.patientName - Patient's name
 * @param {string} appointmentData.patientPhone - Patient's phone number
 * @param {string} appointmentData.doctorName - Doctor's name
 * @param {string} appointmentData.doctorSpecialization - Doctor's specialization
 * @param {Date} appointmentData.appointmentDate - Appointment date
 * @param {string} appointmentData.appointmentTime - Appointment time
 * @param {string} appointmentData.consultationType - Type of consultation (video/in-person)
 * @param {string} appointmentData.appointmentId - Appointment ID
 * @param {string} [appointmentData.invoiceUrl] - Optional invoice PDF URL
 * @returns {Promise<Object>} - Twilio message response
 */
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    if (!twilioClient) {
      logger.warn('Twilio client not initialized - skipping WhatsApp notification');
      return { success: false, message: 'Twilio not configured' };
    }

    const {
      patientName,
      patientPhone,
      doctorName,
      doctorSpecialization,
      appointmentDate,
      appointmentTime,
      consultationType,
      appointmentId,
      invoiceUrl
    } = appointmentData;

    // Validate required fields
    if (!patientPhone) {
      logger.warn('Patient phone number not provided - cannot send WhatsApp');
      return { success: false, message: 'Phone number missing' };
    }

    // Format the date nicely
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create the WhatsApp message
    const message = `🎉 *Appointment Confirmed!*

Dear ${patientName},

Your consultation has been successfully booked!

👨‍⚕️ *Doctor Details:*
Name: Dr. ${doctorName}
Specialization: ${doctorSpecialization}

📅 *Appointment Details:*
Date: ${formattedDate}
Time: ${appointmentTime}
Type: ${consultationType === 'video' ? '🎥 Video Consultation' : '🏥 In-Person Consultation'}

📋 *Appointment ID:* ${appointmentId}

${invoiceUrl ? '📄 *Invoice attached with this message*' : ''}

${consultationType === 'video' ? 
  '💡 You will receive the video call link before your appointment time.' : 
  '💡 Please arrive 10 minutes before your scheduled time.'}

Thank you for choosing our telemedicine service! 

For any queries, please contact our support team.

_This is an automated message. Please do not reply._`;

    // Format phone number for WhatsApp
    const formattedPhone = formatPhoneNumber(patientPhone);
    
    logger.info(`Sending WhatsApp confirmation to ${formattedPhone} for appointment ${appointmentId}`);

    // Send WhatsApp message via Twilio
    // Note: Twilio WhatsApp requires 'whatsapp:' prefix
    const messageOptions = {
      from: `whatsapp:${config.twilio.phoneNumber}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    };

    // Add media URL if invoice is provided
    if (invoiceUrl) {
      messageOptions.mediaUrl = [invoiceUrl];
      logger.info(`Attaching invoice PDF: ${invoiceUrl}`);
    }

    const twilioResponse = await twilioClient.messages.create(messageOptions);

    logger.info(`WhatsApp message sent successfully. SID: ${twilioResponse.sid}`);

    return {
      success: true,
      messageSid: twilioResponse.sid,
      status: twilioResponse.status
    };

  } catch (error) {
    logger.error('Failed to send WhatsApp message:', {
      error: error.message,
      code: error.code,
      moreInfo: error.moreInfo
    });

    // Don't throw error - just log it and return failure
    // We don't want WhatsApp failure to break appointment creation
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

/**
 * Send WhatsApp reminder for upcoming appointment
 * @param {Object} reminderData - Reminder details
 * @returns {Promise<Object>} - Twilio message response
 */
const sendAppointmentReminder = async (reminderData) => {
  try {
    if (!twilioClient) {
      logger.warn('Twilio client not initialized - skipping WhatsApp reminder');
      return { success: false, message: 'Twilio not configured' };
    }

    const {
      patientName,
      patientPhone,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentId
    } = reminderData;

    // Format the date
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    const message = `⏰ *Appointment Reminder*

Dear ${patientName},

This is a reminder for your upcoming appointment:

👨‍⚕️ Doctor: Dr. ${doctorName}
📅 Date: ${formattedDate}
🕐 Time: ${appointmentTime}
📋 Appointment ID: ${appointmentId}

Please make sure you're available at the scheduled time.

_This is an automated reminder. Please do not reply._`;

    const formattedPhone = formatPhoneNumber(patientPhone);

    const twilioResponse = await twilioClient.messages.create({
      from: `whatsapp:${config.twilio.phoneNumber}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    });

    logger.info(`WhatsApp reminder sent successfully. SID: ${twilioResponse.sid}`);

    return {
      success: true,
      messageSid: twilioResponse.sid
    };

  } catch (error) {
    logger.error('Failed to send WhatsApp reminder:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  formatPhoneNumber
};
