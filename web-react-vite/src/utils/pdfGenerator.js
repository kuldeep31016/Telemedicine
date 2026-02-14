/**
 * PDF Generator Utility
 * Generate payment receipts and invoices as PDF
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate Payment Receipt PDF
 * @param {Object} appointmentData - Appointment and payment data
 */
export const generatePaymentReceipt = (appointmentData) => {
  try {
    const {
      appointment,
      patient,
      doctor,
      invoiceNumber,
      invoiceDate
    } = appointmentData;

    // Create new PDF document (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);

    // Header Background
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // DOCTIFY Title - Blue and Bold
    doc.setFontSize(32);
    doc.setTextColor(37, 99, 235); // Blue
    doc.setFont('helvetica', 'bold');
    doc.text('DOCTIFY - PAYMENT RECEIPT', pageWidth / 2, 30, { align: 'center' });

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, 55, pageWidth - margin, 55);

    let yPos = 70;

    // Patient Details & Doctor Details Table
    autoTable(doc, {
      startY: yPos,
      head: [['Patient Details', 'Doctor Details']],
      body: [
        [
          `${patient.name || 'N/A'}\n${patient.email || 'N/A'}\nPhone: ${patient.phone || 'N/A'}`,
          `${doctor.name || 'N/A'}\nSpecialization: ${doctor.specialization || 'N/A'}\nEmail: ${doctor.email || 'N/A'}`
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 11,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: contentWidth / 2 },
        1: { cellWidth: contentWidth / 2 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Order & Payment Information Section
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Order & Payment Information', margin, yPos);
    yPos += 5;

    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    autoTable(doc, {
      startY: yPos,
      body: [
        ['Order ID:', appointment.orderId || 'N/A'],
        ['Payment ID:', appointment.paymentId || 'N/A'],
        ['Payment Status:', 'Paid'],
        ['Payment Method:', 'Netbanking'],
        ['Transaction Date:', invoiceDate]
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          fillColor: [250, 250, 250]
        },
        1: { 
          cellWidth: contentWidth - 50
        }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Appointment Details Section
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Appointment Details', margin, yPos);
    yPos += 5;

    const consultationType = appointment.consultationType === 'video' ? 'Video Consultation' : 'In-Person';
    
    autoTable(doc, {
      startY: yPos,
      body: [
        ['Consultation Type:', consultationType],
        ['Appointment Date:', appointmentDate],
        ['Appointment Time:', appointment.appointmentTime || 'N/A']
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          fillColor: [250, 250, 250]
        },
        1: { 
          cellWidth: contentWidth - 50
        }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Billing Summary Section
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Billing Summary', margin, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      body: [
        ['Consultation Fee:', `Rs ${String(appointment.amount || 0)}`],
        ['Tax:', 'Rs 0'],
        ['Total Paid:', `Rs ${String(appointment.amount || 0)}`]
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          fillColor: [250, 250, 250]
        },
        1: { 
          cellWidth: contentWidth - 50,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        // Apply light green background to Total Paid row (last row, index 2)
        if (data.row.index === 2) {
          data.cell.styles.fillColor = [220, 252, 231]; // Light green
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;

    // Footer Information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your payment!', margin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.text('This is a system-generated receipt. No signature required.', margin, yPos);
    yPos += 5;
    doc.text('Support: support@doctify.com', margin, yPos);

    // Invoice Number at bottom
    yPos = pageHeight - 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Invoice #: ${invoiceNumber}`, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceDate, pageWidth - margin, yPos, { align: 'right' });
    yPos += 4;
    doc.text('Invoice Date:', margin, yPos);

    // Save the PDF
    const fileName = `Payment-Receipt-${invoiceNumber}.pdf`;
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate invoice number from appointment ID
 * @param {String} appointmentId - Appointment MongoDB ID
 * @returns {String} Invoice number
 */
export const generateInvoiceNumber = (appointmentId) => {
  // Format: INV + last 6 chars of appointment ID
  return `INV${appointmentId.slice(-6).toUpperCase()}`;
};

/**
 * Format date for invoice
 * @param {String|Date} date - Date to format
 * @returns {String} Formatted date
 */
export const formatInvoiceDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
