const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Telemedicine Platform API',
      version: '1.0.0',
      description: 'Complete API documentation for the Telemedicine Platform. This platform connects patients with doctors for online consultations, appointment management, medical report analysis, and prescription generation.',
      contact: {
        name: 'API Support',
        email: 'support@telemedicine.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server'
      },
      {
        url: 'https://api.telemedicine.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Firebase authentication token'
        }
      },
      schemas: {
        // User Models
        Patient: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Patient ID'
            },
            firebaseUid: {
              type: 'string',
              description: 'Firebase user ID'
            },
            name: {
              type: 'string',
              description: 'Patient full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Patient email address'
            },
            phone: {
              type: 'string',
              description: 'Patient phone number'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            role: {
              type: 'string',
              enum: ['patient'],
              default: 'patient'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Patient gender'
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                pincode: { type: 'string' }
              }
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Doctor ID'
            },
            firebaseUid: {
              type: 'string',
              description: 'Firebase user ID'
            },
            name: {
              type: 'string',
              description: 'Doctor full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Doctor email address'
            },
            phone: {
              type: 'string',
              description: 'Doctor phone number'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            role: {
              type: 'string',
              enum: ['doctor'],
              default: 'doctor'
            },
            specialization: {
              type: 'string',
              description: 'Medical specialization'
            },
            licenseNumber: {
              type: 'string',
              description: 'Medical license number'
            },
            experience: {
              type: 'number',
              description: 'Years of experience'
            },
            hourlyRate: {
              type: 'number',
              description: 'Consultation fee per session'
            },
            languages: {
              type: 'array',
              items: { type: 'string' },
              description: 'Languages spoken'
            },
            availability: {
              type: 'string',
              description: 'Availability status'
            },
            rating: {
              type: 'number',
              description: 'Doctor rating (0-5)'
            },
            profileImage: {
              type: 'string',
              description: 'Profile image URL'
            },
            about: {
              type: 'string',
              description: 'Doctor biography'
            },
            hospitalName: {
              type: 'string',
              description: 'Hospital name'
            },
            hospitalAddress: {
              type: 'string',
              description: 'Hospital address'
            },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' }
              }
            },
            registrationNumber: {
              type: 'string',
              description: 'Medical registration number'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other']
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            approvalStatus: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
              default: 'PENDING'
            },
            rejectionReason: {
              type: 'string',
              description: 'Reason for rejection if status is REJECTED'
            },
            approvedBy: {
              type: 'string',
              description: 'Admin ID who approved'
            },
            approvedAt: {
              type: 'string',
              format: 'date-time'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Admin: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Admin ID'
            },
            firebaseUid: {
              type: 'string',
              description: 'Firebase user ID'
            },
            name: {
              type: 'string',
              description: 'Admin full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Admin email address'
            },
            phone: {
              type: 'string',
              description: 'Admin phone number'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            role: {
              type: 'string',
              enum: ['admin'],
              default: 'admin'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Appointment ID'
            },
            patientId: {
              type: 'string',
              description: 'Patient ID reference'
            },
            doctorId: {
              type: 'string',
              description: 'Doctor ID reference'
            },
            appointmentDate: {
              type: 'string',
              format: 'date',
              description: 'Appointment date'
            },
            appointmentTime: {
              type: 'string',
              description: 'Appointment time slot'
            },
            consultationType: {
              type: 'string',
              enum: ['video', 'in-person'],
              default: 'video',
              description: 'Type of consultation'
            },
            amount: {
              type: 'number',
              description: 'Consultation amount'
            },
            paymentId: {
              type: 'string',
              description: 'Razorpay payment ID'
            },
            orderId: {
              type: 'string',
              description: 'Razorpay order ID'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'refunded'],
              default: 'pending'
            },
            status: {
              type: 'string',
              enum: ['confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
              default: 'confirmed'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            prescription: {
              type: 'string',
              description: 'Prescription details'
            },
            diagnosis: {
              type: 'string',
              description: 'Diagnosis details'
            },
            meetingLink: {
              type: 'string',
              description: 'Video consultation link'
            },
            meetingId: {
              type: 'string',
              description: 'Video meeting ID'
            },
            calendarEventId: {
              type: 'string',
              description: 'Google Calendar event ID'
            },
            calendarEventLink: {
              type: 'string',
              description: 'Google Calendar event link'
            },
            callStarted: {
              type: 'boolean',
              default: false
            },
            callStartedBy: {
              type: 'string',
              enum: ['doctor', 'patient']
            },
            callStartedAt: {
              type: 'string',
              format: 'date-time'
            },
            callEndedAt: {
              type: 'string',
              format: 'date-time'
            },
            consultationDuration: {
              type: 'number',
              description: 'Duration in minutes'
            },
            relatedMedicalReport: {
              type: 'string',
              description: 'Related medical report ID'
            },
            rescheduleRequestedBy: {
              type: 'string',
              enum: ['doctor', 'patient']
            },
            rescheduleRequestedAt: {
              type: 'string',
              format: 'date-time'
            },
            proposedAppointmentDate: {
              type: 'string',
              format: 'date'
            },
            proposedAppointmentTime: {
              type: 'string'
            },
            rescheduleStatus: {
              type: 'string',
              enum: ['none', 'pending', 'accepted', 'rejected', 'expired'],
              default: 'none'
            },
            refundStatus: {
              type: 'string',
              enum: ['none', 'pending', 'refunded'],
              default: 'none'
            },
            refundAmount: {
              type: 'number',
              default: 0
            },
            refundedAt: {
              type: 'string',
              format: 'date-time'
            },
            cancellationReason: {
              type: 'string'
            },
            cancelledBy: {
              type: 'string',
              enum: ['patient', 'doctor', 'admin', 'auto']
            },
            cancelledAt: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Prescription: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Prescription ID'
            },
            appointmentId: {
              type: 'string',
              description: 'Appointment ID reference'
            },
            patientId: {
              type: 'string',
              description: 'Patient ID reference'
            },
            doctorId: {
              type: 'string',
              description: 'Doctor ID reference'
            },
            diagnosis: {
              type: 'string',
              description: 'Medical diagnosis'
            },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Medicine name' },
                  dosage: { type: 'string', description: 'Dosage amount' },
                  frequency: { type: 'string', description: 'How often to take' },
                  duration: { type: 'string', description: 'Duration of treatment' },
                  instructions: { type: 'string', description: 'Special instructions' }
                }
              }
            },
            testsRecommended: {
              type: 'array',
              items: { type: 'string' },
              description: 'Recommended medical tests'
            },
            followUpDate: {
              type: 'string',
              format: 'date',
              description: 'Follow-up appointment date'
            },
            specialInstructions: {
              type: 'string',
              description: 'Special instructions for patient'
            },
            pdfUrl: {
              type: 'string',
              description: 'PDF file URL'
            },
            pdfS3Key: {
              type: 'string',
              description: 'S3 storage key'
            },
            verificationCode: {
              type: 'string',
              description: 'QR code verification code'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            viewedByPatient: {
              type: 'boolean',
              default: false
            },
            viewedAt: {
              type: 'string',
              format: 'date-time'
            },
            downloadCount: {
              type: 'number',
              default: 0
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        MedicalReport: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Medical report ID'
            },
            patientId: {
              type: 'string',
              description: 'Patient ID reference'
            },
            reportType: {
              type: 'string',
              enum: ['pdf', 'image', 'lab_test', 'prescription', 'scan', 'other'],
              description: 'Type of medical report'
            },
            reportTitle: {
              type: 'string',
              description: 'Report title'
            },
            description: {
              type: 'string',
              description: 'Report description'
            },
            fileUrl: {
              type: 'string',
              description: 'File URL'
            },
            fileName: {
              type: 'string',
              description: 'Original file name'
            },
            fileSize: {
              type: 'number',
              description: 'File size in bytes'
            },
            mimeType: {
              type: 'string',
              description: 'File MIME type'
            },
            s3Key: {
              type: 'string',
              description: 'S3 storage key'
            },
            processingStatus: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              default: 'pending'
            },
            extractedText: {
              type: 'string',
              description: 'OCR extracted text'
            },
            processingError: {
              type: 'string',
              description: 'Error message if processing failed'
            },
            processedAt: {
              type: 'string',
              format: 'date-time'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Search tags'
            },
            reportDate: {
              type: 'string',
              format: 'date',
              description: 'Date when medical test was conducted'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Message ID'
            },
            appointmentId: {
              type: 'string',
              description: 'Appointment ID reference'
            },
            senderId: {
              type: 'string',
              description: 'Sender ID (Doctor or Patient)'
            },
            senderModel: {
              type: 'string',
              enum: ['Doctor', 'Patient'],
              description: 'Sender model type'
            },
            receiverId: {
              type: 'string',
              description: 'Receiver ID (Doctor or Patient)'
            },
            receiverModel: {
              type: 'string',
              enum: ['Doctor', 'Patient'],
              description: 'Receiver model type'
            },
            message: {
              type: 'string',
              description: 'Message content'
            },
            isRead: {
              type: 'boolean',
              default: false
            },
            readAt: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // Request/Response Models
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'phone', 'role'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            role: {
              type: 'string',
              enum: ['patient', 'doctor', 'admin'],
              description: 'User role'
            },
            specialization: {
              type: 'string',
              description: 'Required for doctor registration'
            },
            licenseNumber: {
              type: 'string',
              description: 'Required for doctor registration'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            user: {
              oneOf: [
                { $ref: '#/components/schemas/Patient' },
                { $ref: '#/components/schemas/Doctor' },
                { $ref: '#/components/schemas/Admin' }
              ]
            }
          }
        },
        CreateAppointmentOrderRequest: {
          type: 'object',
          required: ['doctorId', 'appointmentDate', 'appointmentTime', 'consultationType'],
          properties: {
            doctorId: {
              type: 'string',
              description: 'Doctor ID'
            },
            appointmentDate: {
              type: 'string',
              format: 'date',
              description: 'Appointment date (YYYY-MM-DD)'
            },
            appointmentTime: {
              type: 'string',
              description: 'Appointment time slot (e.g., "10:00 AM")'
            },
            consultationType: {
              type: 'string',
              enum: ['video', 'in-person'],
              default: 'video'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            relatedMedicalReport: {
              type: 'string',
              description: 'Related medical report ID (optional)'
            }
          }
        },
        CreateAppointmentOrderResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            orderId: {
              type: 'string',
              description: 'Razorpay order ID'
            },
            amount: {
              type: 'number',
              description: 'Amount in INR'
            },
            currency: {
              type: 'string',
              example: 'INR'
            },
            appointmentId: {
              type: 'string',
              description: 'Created appointment ID'
            }
          }
        },
        VerifyPaymentRequest: {
          type: 'object',
          required: ['orderId', 'paymentId', 'signature', 'appointmentId'],
          properties: {
            orderId: {
              type: 'string',
              description: 'Razorpay order ID'
            },
            paymentId: {
              type: 'string',
              description: 'Razorpay payment ID'
            },
            signature: {
              type: 'string',
              description: 'Razorpay signature'
            },
            appointmentId: {
              type: 'string',
              description: 'Appointment ID'
            }
          }
        },
        CreatePrescriptionRequest: {
          type: 'object',
          required: ['appointmentId', 'diagnosis', 'medicines'],
          properties: {
            appointmentId: {
              type: 'string',
              description: 'Appointment ID'
            },
            diagnosis: {
              type: 'string',
              description: 'Medical diagnosis'
            },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'dosage', 'frequency', 'duration'],
                properties: {
                  name: { type: 'string' },
                  dosage: { type: 'string' },
                  frequency: { type: 'string' },
                  duration: { type: 'string' },
                  instructions: { type: 'string' }
                }
              }
            },
            testsRecommended: {
              type: 'array',
              items: { type: 'string' }
            },
            followUpDate: {
              type: 'string',
              format: 'date'
            },
            specialInstructions: {
              type: 'string'
            }
          }
        },
        AnalyzeSymptomsRequest: {
          type: 'object',
          required: ['symptoms'],
          properties: {
            symptoms: {
              type: 'string',
              description: 'Patient symptoms description'
            }
          }
        },
        GenerateTokenRequest: {
          type: 'object',
          required: ['channelName', 'appointmentId'],
          properties: {
            channelName: {
              type: 'string',
              description: 'Agora channel name'
            },
            appointmentId: {
              type: 'string',
              description: 'Appointment ID'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Unauthorized',
                error: 'No token provided or invalid token'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Forbidden',
                error: 'You do not have permission to perform this action'
              }
            }
          }
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Not Found',
                error: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Validation Error',
                error: 'Invalid request data'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Doctors',
        description: 'Doctor-specific endpoints for profile and appointments'
      },
      {
        name: 'Appointments',
        description: 'Appointment booking and management endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints for platform management'
      },
      {
        name: 'Video Consultation',
        description: 'Video call and consultation endpoints'
      },
      {
        name: 'Chat',
        description: 'In-appointment chat messaging endpoints'
      },
      {
        name: 'Medical Reports',
        description: 'Medical report upload and analysis endpoints'
      },
      {
        name: 'Prescriptions',
        description: 'Prescription creation and management endpoints'
      },
      {
        name: 'Health',
        description: 'API health check endpoints'
      }
    ]
  },
  apis: [
    './src/docs/swagger.endpoints.js',
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
