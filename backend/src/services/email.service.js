const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Initialize email transporter
let transporter = null;

const initializeEmailTransporter = () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Email credentials not configured - Email notifications will be disabled');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    logger.info('Email transporter initialized successfully');
    return transporter;
  } catch (error) {
    logger.error('Failed to initialize email transporter:', error);
    return null;
  }
};

// Initialize on module load
initializeEmailTransporter();

/**
 * Send appointment confirmation email to patient and doctor
 * @param {Object} data - Appointment details
 * @returns {Promise<Object>} - Email send result
 */
const sendAppointmentEmail = async (data) => {
  try {
    if (!transporter) {
      logger.warn('Email transporter not initialized - skipping email notification');
      return { success: false, message: 'Email not configured' };
    }

    const {
      patientName,
      patientEmail,
      doctorName,
      doctorEmail,
      doctorSpecialization,
      appointmentDate,
      appointmentTime,
      consultationType,
      appointmentId,
      amount
    } = data;

    // Format date nicely
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email template for patient
    const patientEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Appointment Confirmed!</h1>
            <p>Your consultation has been successfully booked</p>
          </div>
          <div class="content">
            <p>Dear <strong>${patientName}</strong>,</p>
            <p>Your appointment has been confirmed. Here are your appointment details:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">👨‍⚕️ Doctor:</span>
                <span class="value">Dr. ${doctorName}</span>
              </div>
              <div class="detail-row">
                <span class="label">🏥 Specialization:</span>
                <span class="value">${doctorSpecialization}</span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Date:</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">🕐 Time:</span>
                <span class="value">${appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">📱 Type:</span>
                <span class="value">${consultationType === 'video' ? '🎥 Video Consultation' : '🏥 In-Person Consultation'}</span>
              </div>
              <div class="detail-row">
                <span class="label">💰 Consultation Fee:</span>
                <span class="value">₹ ${amount}</span>
              </div>
              <div class="detail-row">
                <span class="label">📋 Appointment ID:</span>
                <span class="value">${appointmentId}</span>
              </div>
            </div>

            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>${consultationType === 'video' ? 'You will receive the video call link before your appointment time' : 'Please arrive 10 minutes before your scheduled time'}</li>
              <li>Check your WhatsApp for appointment confirmation and invoice PDF</li>
              <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
            </ul>

            <p style="text-align: center;">
              <a href="#" class="button">View My Appointments</a>
            </p>

            <div class="footer">
              <p>Thank you for choosing Doctify Telemedicine Platform</p>
              <p>For any queries, contact us at support@doctify.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email template for doctor
    const doctorEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Appointment Scheduled</h1>
            <p>A new patient has booked a consultation with you</p>
          </div>
          <div class="content">
            <p>Dear <strong>Dr. ${doctorName}</strong>,</p>
            <p>You have a new appointment scheduled. Here are the details:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">👤 Patient:</span>
                <span class="value">${patientName}</span>
              </div>
              <div class="detail-row">
                <span class="label">📧 Patient Email:</span>
                <span class="value">${patientEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Date:</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">🕐 Time:</span>
                <span class="value">${appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">📱 Type:</span>
                <span class="value">${consultationType === 'video' ? '🎥 Video Consultation' : '🏥 In-Person Consultation'}</span>
              </div>
              <div class="detail-row">
                <span class="label">💰 Consultation Fee:</span>
                <span class="value">₹ ${amount}</span>
              </div>
              <div class="detail-row">
                <span class="label">📋 Appointment ID:</span>
                <span class="value">${appointmentId}</span>
              </div>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Log in to your dashboard to view appointment details</li>
              <li>Prepare patient records and consultation notes</li>
              <li>${consultationType === 'video' ? 'Join the video call at the scheduled time' : 'Be available at the clinic 10 minutes before'}</li>
            </ul>

            <p style="text-align: center;">
              <a href="#" class="button">View Appointments</a>
            </p>

            <div class="footer">
              <p>Doctify Telemedicine Platform</p>
              <p>For technical support, contact support@doctify.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to patient
    const patientMailOptions = {
      from: `"Doctify Telemedicine" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: `✅ Appointment Confirmed - Dr. ${doctorName} on ${formattedDate}`,
      html: patientEmailHTML
    };

    // Send email to doctor
    const doctorMailOptions = {
      from: `"Doctify Telemedicine" <${process.env.SMTP_USER}>`,
      to: doctorEmail,
      subject: `📅 New Appointment - ${patientName} on ${formattedDate}`,
      html: doctorEmailHTML
    };

    // Send both emails
    logger.info(`Sending appointment confirmation emails to ${patientEmail} and ${doctorEmail}`);
    
    const [patientResult, doctorResult] = await Promise.allSettled([
      transporter.sendMail(patientMailOptions),
      transporter.sendMail(doctorMailOptions)
    ]);

    const patientSent = patientResult.status === 'fulfilled';
    const doctorSent = doctorResult.status === 'fulfilled';

    if (patientSent && doctorSent) {
      logger.info('Appointment emails sent successfully to both patient and doctor');
      return {
        success: true,
        message: 'Emails sent successfully',
        patientSent: true,
        doctorSent: true
      };
    } else if (patientSent || doctorSent) {
      logger.warn(`Partial email success: Patient=${patientSent}, Doctor=${doctorSent}`);
      return {
        success: true,
        message: 'Email sent partially',
        patientSent,
        doctorSent
      };
    } else {
      logger.error('Failed to send appointment emails to both recipients');
      return {
        success: false,
        message: 'Failed to send emails',
        patientSent: false,
        doctorSent: false
      };
    }

  } catch (error) {
    logger.error('Error sending appointment email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

module.exports = {
  sendAppointmentEmail
};
