import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  X, 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { patientAPI } from '../../../api';

const BookingModal = ({ isOpen, onClose, doctor, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    consultationType: 'in-person'
  });

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isAvailable: i % 3 !== 0 // Mock: every 3rd day is unavailable
      });
    }
    return dates;
  };

  const [availableDates] = useState(generateDates());
  const [availableSlots, setAvailableSlots] = useState([]);

  // Time slots
  const allTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    if (bookingData.date) {
      // Mock API call to fetch available slots for selected date
      // In production, call: await patientAPI.getAvailableSlots(doctorId, date)
      const mockAvailableSlots = allTimeSlots.filter((_, index) => index % 2 === 0);
      setAvailableSlots(mockAvailableSlots);
    }
  }, [bookingData.date]);

  const handleClose = () => {
    onClose();
    setStep(1);
    setBookingData({ date: '', time: '', consultationType: 'in-person' });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);

    // Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Please check your internet connection.');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create Razorpay order from backend
      const orderResponse = await patientAPI.createAppointmentOrder({
        doctorId: doctor._id,
        amount: doctor.hourlyRate || 500,
        appointmentDate: bookingData.date,
        appointmentTime: bookingData.time,
        consultationType: bookingData.consultationType
      });

      console.log('Order API Response:', orderResponse);
      
      // Extract order details from nested response
      const orderData = orderResponse.data || orderResponse;
      const createdOrderId = orderData.orderId;
      
      console.log('Created Order ID stored:', createdOrderId);
      console.log('Order data:', orderData);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Doctify',
        description: `Appointment with ${doctor.name}`,
        order_id: createdOrderId,
        handler: async function (response) {
          try {
            console.log('Razorpay payment response:', response);
            console.log('Stored createdOrderId in handler:', createdOrderId);
            
            // Use stored orderId if not in response (happens with some test payment methods)
            const orderId = response.razorpay_order_id || createdOrderId;
            const paymentId = response.razorpay_payment_id;
            const signature = response.razorpay_signature || '';
            
            console.log('OrderId resolution:', {
              fromResponse: response.razorpay_order_id,
              fromStored: createdOrderId,
              final: orderId,
              isUndefined: orderId === undefined
            });
            
            // Validate we at least have payment_id and order_id
            if (!paymentId) {
              console.error('Missing payment ID in response');
              throw new Error('Payment ID not received from Razorpay');
            }
            
            if (!orderId) {
              console.error('Missing order ID - neither in response nor stored');
              throw new Error('Order ID not available for verification');
            }
            
            console.log('Processing payment verification:', {
              orderId,
              paymentId,
              hasSignature: !!signature
            });
            
            // Step 2: Verify payment signature on backend
            const verifyResponse = await patientAPI.verifyPayment({
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
              doctorId: doctor._id,
              appointmentDate: bookingData.date,
              appointmentTime: bookingData.time,
              consultationType: bookingData.consultationType,
              amount: doctor.hourlyRate || 500
            });

            if (verifyResponse.success) {
              // Step 3: Confirm booking (backend creates appointment after verification)
              await onConfirm({
                ...bookingData,
                doctorId: doctor._id,
                amount: doctor.hourlyRate || 500,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentStatus: 'paid',
                status: 'confirmed',
                appointmentId: verifyResponse.appointmentId
              });

              setIsLoading(false);
              setStep(4); // Success step
              toast.success('Appointment booked successfully!');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            setIsLoading(false);
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: 'Patient Name', // TODO: Replace with actual patient name from auth store
          email: 'patient@example.com', // TODO: Replace with actual patient email
          contact: '9999999999' // TODO: Replace with actual patient phone
        },
        theme: {
          color: '#2563EB'
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            toast.error('Payment cancelled');
          },
          onerror: function(error) {
            setIsLoading(false);
            console.error('Razorpay payment error:', error);
            toast.error('Payment failed. Please try again.');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to initialize payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  if (!doctor || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#0F172A]" style={{letterSpacing: '-0.3px'}}>
                    Book Appointment
                  </h2>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    {step === 1 && 'Select a date'}
                    {step === 2 && 'Choose your preferred time'}
                    {step === 3 && 'Review and proceed to payment'}
                    {step === 4 && 'Booking confirmed!'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>

              {/* Progress Bar */}
              {step < 4 && (
                <div className="px-6 pt-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`h-1 flex-1 rounded-full transition-all ${
                          s <= step ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-medium text-[#64748B]">Date</span>
                    <span className="text-[10px] font-medium text-[#64748B]">Time</span>
                    <span className="text-[10px] font-medium text-[#64748B]">Review</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Select Date */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4" style={{letterSpacing: '-0.3px'}}>
                          Select Date
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {availableDates.map((date, index) => (
                            <button
                              key={index}
                              onClick={() => date.isAvailable && setBookingData({ ...bookingData, date: date.full })}
                              disabled={!date.isAvailable}
                              className={`p-3 rounded-lg transition-all text-center ${
                                bookingData.date === date.full
                                  ? 'bg-[#2563EB] text-white'
                                  : date.isAvailable
                                  ? 'bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A]'
                                  : 'bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed opacity-50'
                              }`}
                            >
                              <div className="text-[10px] font-medium mb-1">{date.day}</div>
                              <div className="text-[14px] font-semibold">{date.date}</div>
                              <div className="text-[10px]">{date.month}</div>
                            </button>
                          ))}
                        </div>
                        {bookingData.date && (
                          <p className="text-[12px] text-[#16A34A] mt-3 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Date selected: {new Date(bookingData.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Select Time */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4" style={{letterSpacing: '-0.3px'}}>
                          Available Time Slots
                        </h3>
                        {availableSlots.length > 0 ? (
                          <div className="grid grid-cols-4 gap-3">
                            {availableSlots.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => setBookingData({ ...bookingData, time: slot })}
                                className={`py-3 px-2 rounded-lg text-[12px] font-medium transition-all ${
                                  bookingData.time === slot
                                    ? 'bg-[#2563EB] text-white'
                                    : 'bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0]'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-[#FEF3C7] rounded-lg">
                            <AlertCircle className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                            <p className="text-[14px] font-medium text-[#92400E]">No slots available</p>
                            <p className="text-[12px] text-[#92400E] mt-1">Please select another date</p>
                          </div>
                        )}
                      </div>

                      {/* Consultation Type */}
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4" style={{letterSpacing: '-0.3px'}}>
                          Consultation Type
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setBookingData({ ...bookingData, consultationType: 'in-person' })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              bookingData.consultationType === 'in-person'
                                ? 'border-[#2563EB] bg-[#EFF6FF]'
                                : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                            }`}
                          >
                            <Users className={`w-5 h-5 mb-2 ${
                              bookingData.consultationType === 'in-person' ? 'text-[#2563EB]' : 'text-[#64748B]'
                            }`} />
                            <p className="text-[14px] font-semibold text-[#0F172A]">In-Person</p>
                            <p className="text-[12px] text-[#64748B]">Visit clinic</p>
                          </button>
                          <button
                            onClick={() => setBookingData({ ...bookingData, consultationType: 'video' })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              bookingData.consultationType === 'video'
                                ? 'border-[#2563EB] bg-[#EFF6FF]'
                                : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                            }`}
                          >
                            <Video className={`w-5 h-5 mb-2 ${
                              bookingData.consultationType === 'video' ? 'text-[#2563EB]' : 'text-[#64748B]'
                            }`} />
                            <p className="text-[14px] font-semibold text-[#0F172A]">Video Call</p>
                            <p className="text-[12px] text-[#64748B]">Online consult</p>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review Summary */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[16px] font-semibold text-[#0F172A]" style={{letterSpacing: '-0.3px'}}>
                        Appointment Summary
                      </h3>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-lg">
                        <img
                          src={
                            doctor.profileImage 
                              ? (doctor.profileImage.startsWith('http') 
                                  ? doctor.profileImage 
                                  : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${doctor.profileImage}`)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=random`
                          }
                          alt={doctor.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-[16px] font-semibold text-[#0F172A]">{doctor.name}</h4>
                          <p className="text-[14px] text-[#64748B]">{doctor.specialization}</p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-3 p-4 bg-[#F8FAFC] rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#64748B]">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[14px]">Date</span>
                          </div>
                          <span className="text-[14px] font-semibold text-[#0F172A]">
                            {new Date(bookingData.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#64748B]">
                            <Clock className="w-4 h-4" />
                            <span className="text-[14px]">Time</span>
                          </div>
                          <span className="text-[14px] font-semibold text-[#0F172A]">{bookingData.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#64748B]">
                            <Video className="w-4 h-4" />
                            <span className="text-[14px]">Type</span>
                          </div>
                          <span className="text-[14px] font-semibold text-[#0F172A] capitalize">{bookingData.consultationType}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                          <span className="text-[14px] font-medium text-[#64748B]">Consultation Fee</span>
                          <span className="text-[18px] font-semibold text-[#0F172A]">₹ {doctor.hourlyRate || 500}</span>
                        </div>
                      </div>

                      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                        <p className="text-[12px] text-[#1E40AF]">
                          <strong>Note:</strong> You'll be redirected to Razorpay for secure payment. Your appointment will be confirmed only after successful payment.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[#16A34A]" />
                      </div>
                      <h3 className="text-[20px] font-semibold text-[#0F172A] mb-2">Booking Confirmed!</h3>
                      <p className="text-[14px] text-[#64748B] mb-6">
                        Your appointment has been successfully booked. Check your email for confirmation details.
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-all"
                      >
                        Go to Dashboard
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {step < 4 && (
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-4 py-2.5 text-[#64748B] hover:text-[#0F172A] font-medium rounded-lg hover:bg-[#F8FAFC] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    onClick={() => {
                      if (step === 1 && bookingData.date) setStep(2);
                      else if (step === 2 && bookingData.time) setStep(3);
                      else if (step === 3) handlePayment();
                    }}
                    disabled={
                      isLoading ||
                      (step === 1 && !bookingData.date) ||
                      (step === 2 && !bookingData.time)
                    }
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
                  >
                    {isLoading ? (
                      'Processing...'
                    ) : step === 3 ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Proceed to Payment
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
