import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Receipt,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const BillsPayments = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - replace with API calls
  const payments = [
    {
      id: 'INV001234',
      doctor: 'Dr. Dhwani Bhanusali',
      service: 'General Consultation',
      date: 'April 26, 2026',
      amount: 500,
      status: 'pending',
      dueDate: 'May 1, 2026',
      paymentMethod: null
    },
    {
      id: 'INV001235',
      doctor: 'Dr. Rakhi Singh',
      service: 'Follow-up Consultation',
      date: 'April 28, 2026',
      amount: 500,
      status: 'pending',
      dueDate: 'May 3, 2026',
      paymentMethod: null
    },
    {
      id: 'INV001230',
      doctor: 'Dr. Aditya Sharma',
      service: 'Video Consultation',
      date: 'April 10, 2026',
      amount: 800,
      status: 'paid',
      paidDate: 'April 10, 2026',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV001231',
      doctor: 'Dr. Priya Patel',
      service: 'Skin Treatment',
      date: 'April 5, 2026',
      amount: 600,
      status: 'paid',
      paidDate: 'April 5, 2026',
      paymentMethod: 'UPI'
    },
    {
      id: 'INV001229',
      doctor: 'Dr. Rajesh Kumar',
      service: 'Orthopedic Consultation',
      date: 'April 15, 2026',
      amount: 700,
      status: 'refunded',
      refundDate: 'April 16, 2026',
      refundReason: 'Appointment cancelled'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'paid', label: 'Paid' },
    { id: 'refunded', label: 'Refunded' }
  ];

  const filteredPayments = activeTab === 'all' 
    ? payments 
    : payments.filter(p => p.status === activeTab);

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'paid':
        return {
          icon: CheckCircle,
          label: 'Paid',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'refunded':
        return {
          icon: RefreshCw,
          label: 'Refunded',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Unknown',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const handlePayNow = (paymentId) => {
    console.log('Pay now:', paymentId);
    // Implement payment logic
  };

  const handleDownloadInvoice = (paymentId) => {
    console.log('Download invoice:', paymentId);
    // Implement download logic
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Bills & Payments</h1>
        <p className="text-slate-500 font-medium">Manage your payment history, pending bills, and invoices.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              {payments.filter(p => p.status === 'pending').length} Bills
            </span>
          </div>
          <h3 className="text-3xl font-black mb-1">₹ {totalPending.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-white/80">Pending Payments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <h3 className="text-3xl font-black mb-1">₹ {totalPaid.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-white/80">Total Paid</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {payments.filter(p => p.status === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 ${statusConfig.bgColor} rounded-xl flex items-center justify-center`}>
                      <Receipt className={`w-6 h-6 ${statusConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-900">{payment.service}</h3>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{payment.doctor}</p>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{payment.date}</span>
                            </div>
                            {payment.status === 'pending' && payment.dueDate && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-orange-600 font-semibold">Due: {payment.dueDate}</span>
                              </>
                            )}
                            {payment.status === 'paid' && payment.paymentMethod && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span>{payment.paymentMethod}</span>
                              </>
                            )}
                            {payment.status === 'refunded' && payment.refundReason && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-blue-600">{payment.refundReason}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">₹ {payment.amount}</p>
                      <p className="text-xs text-slate-500 font-medium">Invoice: {payment.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handlePayNow(payment.id)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadInvoice(payment.id)}
                        className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt size={28} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No {activeTab} payments</h3>
            <p className="text-slate-500 font-medium">You don't have any {activeTab} payments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsPayments;
