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

    // Check if refunded
    const isRefunded = appointment.status === 'cancelled' && appointment.refundStatus === 'refunded';
    const paymentStatus = isRefunded ? 'Refunded' : 'Paid';

    const paymentInfoData = [
      ['Order ID:', appointment.orderId || 'N/A'],
      ['Payment ID:', appointment.paymentId || 'N/A'],
      ['Payment Status:', paymentStatus],
      ['Payment Method:', 'Netbanking'],
      ['Transaction Date:', invoiceDate]
    ];

    // Add refund information if applicable
    if (isRefunded) {
      paymentInfoData.push(['Refund Date:', appointment.refundedAt ? new Date(appointment.refundedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A']);
      paymentInfoData.push(['Refund Amount:', `Rs ${String(appointment.refundAmount || appointment.amount || 0)}`]);
    }

    autoTable(doc, {
      startY: yPos,
      body: paymentInfoData,
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
      didParseCell: function(data) {
        // Highlight refund status in red
        if (isRefunded && data.row.index === 2) {
          data.cell.styles.textColor = [220, 38, 38]; // Red
          data.cell.styles.fontStyle = 'bold';
        }
        // Highlight refund information rows in light red
        if (isRefunded && data.row.index >= 5) {
          data.cell.styles.fillColor = [254, 226, 226]; // Light red
          data.cell.styles.fontStyle = 'bold';
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

    const billingSummaryData = [
      ['Consultation Fee:', `Rs ${String(appointment.amount || 0)}`],
      ['Tax:', 'Rs 0']
    ];

    if (isRefunded) {
      billingSummaryData.push(['Original Amount Paid:', `Rs ${String(appointment.amount || 0)}`]);
      billingSummaryData.push(['REFUND AMOUNT:', `Rs ${String(appointment.refundAmount || appointment.amount || 0)}`]);
    } else {
      billingSummaryData.push(['Total Paid:', `Rs ${String(appointment.amount || 0)}`]);
    }

    autoTable(doc, {
      startY: yPos,
      body: billingSummaryData,
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
        // Apply different backgrounds for paid/refunded rows
        if (isRefunded) {
          // Original Amount Paid row (index 2) - light yellow
          if (data.row.index === 2) {
            data.cell.styles.fillColor = [254, 243, 199]; // Light yellow/amber
            data.cell.styles.fontStyle = 'bold';
          }
          // REFUND AMOUNT row (index 3) - prominent red
          if (data.row.index === 3) {
            data.cell.styles.fillColor = [254, 226, 226]; // Light red
            data.cell.styles.textColor = [220, 38, 38]; // Bright red text
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fontSize = 11; // Larger font
          }
        } else {
          // Total Paid row (index 2) - light green
          if (data.row.index === 2) {
            data.cell.styles.fillColor = [220, 252, 231]; // Light green
            data.cell.styles.textColor = [0, 0, 0];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Refund Notice (if applicable)
    if (isRefunded) {
      // Background box for refund notice
      doc.setFillColor(254, 226, 226); // Light red
      doc.roundedRect(margin, yPos - 3, contentWidth, 25, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(153, 27, 27); // Dark red
      doc.text('REFUND NOTICE', margin + 5, yPos + 5);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 20, 20);
      doc.text('• Full refund processed with NO DEDUCTION', margin + 5, yPos + 12);
      doc.text(`• Refund Amount: Rs ${String(appointment.refundAmount || appointment.amount || 0)}`, margin + 5, yPos + 18);
      
      if (appointment.cancellationReason) {
        doc.setFontSize(8);
        doc.text(`Reason: ${appointment.cancellationReason}`, margin + 5, yPos + 24);
      }
      
      yPos += 30;
    }

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;

    // Footer Information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(isRefunded ? 'This appointment was cancelled and refunded.' : 'Thank you for your payment!', margin, yPos);
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
