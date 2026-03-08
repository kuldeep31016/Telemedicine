const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Initialize email transporter
let transporter = null;

/**
 * Generate iCalendar (.ics) file content for calendar invite
 * @param {Object} data - Appointment details
 * @returns {string} - iCalendar file content
 */
const generateICalendar = (data) => {
  const { patientName, patientEmail, doctorName, doctorEmail, appointmentDate, appointmentTime, consultationType, appointmentId } = data;
  
  // Parse appointment date and time
  const dateStr = new Date(appointmentDate).toISOString().split('T')[0];
  const timeStr = convertTo24Hour(appointmentTime);
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes
  
  // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
  const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const now = new Date();
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Doctify Telemedicine//Appointment//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:appointment-${appointmentId}@Telemedicine.com
DTSTAMP:${formatICalDate(now)}
DTSTART:${formatICalDate(startDateTime)}
DTEND:${formatICalDate(endDateTime)}
SUMMARY:Medical Appointment: ${patientName} with Dr. ${doctorName}
DESCRIPTION:Telemedicine Appointment\\n\\nPatient: ${patientName}\\nDoctor: Dr. ${doctorName}\\nType: ${consultationType === 'video' ? 'Video Consultation' : 'In-Person Consultation'}\\n\\nAppointment ID: ${appointmentId}
LOCATION:${consultationType === 'video' ? 'Online - Video Call' : 'Clinic'}
STATUS:CONFIRMED
SEQUENCE:0
ORGANIZER;CN=Doctify Telemedicine:mailto:${process.env.SMTP_USER}
ATTENDEE;CN=${patientName};RSVP=TRUE:mailto:${patientEmail}
ATTENDEE;CN=Dr. ${doctorName};RSVP=TRUE:mailto:${doctorEmail}
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Appointment in 24 hours
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: Appointment in 1 hour
END:VALARM
END:VEVENT
END:VCALENDAR`;
  
  return icsContent;
};

/**
 * Convert 12-hour time format to 24-hour format
 * @param {string} time12h - Time in 12-hour format (e.g., "09:00 AM")
 * @returns {string} - Time in 24-hour format (e.g., "09:00")
 */
const convertTo24Hour = (time12h) => {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

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
              <p>Thank you for choosing Telemedicine Platform</p>
              <p>For any queries, contact us at soonlay.tech@gmail.com</p>
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
              <p>Telemedicine Platform</p>
              <p>For technical support, contact soonlay.tech@gmail.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Generate iCalendar file for calendar invite
    const icsContent = generateICalendar(data);

    // Send email to patient
    const patientMailOptions = {
      from: `"Telemedicine Platform" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: `✅ Appointment Confirmed - Dr. ${doctorName} on ${formattedDate}`,
      html: patientEmailHTML,
      attachments: [
        {
          filename: 'appointment.ics',
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ],
      icalEvent: {
        filename: 'appointment.ics',
        method: 'request',
        content: icsContent
      }
    };

    // Send email to doctor
    const doctorMailOptions = {
      from: `"Telemedicine Platform" <${process.env.SMTP_USER}>`,
      to: doctorEmail,
      subject: `📅 New Appointment - ${patientName} on ${formattedDate}`,
      html: doctorEmailHTML,
      attachments: [
        {
          filename: 'appointment.ics',
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ],
      icalEvent: {
        filename: 'appointment.ics',
        method: 'request',
        content: icsContent
      }
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

/**
 * Send contact form message to admin email
 */
const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    if (!transporter) {
      logger.warn('Email transporter not initialized - skipping contact email');
      return { success: false, message: 'Email not configured' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6C5DD3 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #6C5DD3; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .value { color: #333; font-size: 15px; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6C5DD3; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Message</h1>
            <p>Someone reached out via the Telemedicine website</p>
          </div>
          <div class="content">
            <div class="details">
              <div class="detail-row">
                <span class="label">👤 Name</span>
                <span class="value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="label">📧 Email</span>
                <span class="value"><a href="mailto:${email}" style="color:#6C5DD3;">${email}</a></span>
              </div>
              <div class="detail-row">
                <span class="label">📝 Subject</span>
                <span class="value">${subject}</span>
              </div>
            </div>

            <div class="message-box">
              <span class="label">💬 Message</span>
              <p style="margin-top:8px; white-space: pre-wrap;">${message}</p>
            </div>

            <div class="footer">
              <p>Sent from the Contact Us form on Telemedicine Platform</p>
              <p>Reply directly to this email to respond to ${name}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Telemedicine Platform" <${process.env.SMTP_USER}>`,
      to: 'iamkuldeepraj06@gmail.com',
      replyTo: email,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html,
    });

    logger.info(`Contact email sent from ${email}`);
    return { success: true };
  } catch (error) {
    logger.error('Error sending contact email:', error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendAppointmentEmail,
  sendContactEmail
};
