import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Check, X, CreditCard, User, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ProviderPaymentVerify = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await api.get(`/bookings/${bookingId}`);
        setBooking(bookingRes.data);

        try {
          const paymentRes = await api.get(`/payments/booking/${bookingId}`);
          setPayment(paymentRes.data);
        } catch (err) {
          // No payment found
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handleVerify = async (status) => {
    setActionLoading(true);
    try {
      await api.put(`/payments/${payment.id}/verify-manual`, { 
        status: status, 
        booking_id: bookingId 
      });
      
      setPayment({ ...payment, payment_status: status });
      setStatusMessage(`Payment has been ${status.toLowerCase()}`);
      
      // Notify User via WhatsApp
      const userPhone = booking.phone_number || booking.phone;
      if (userPhone && status === 'Verified') {
        const whatsappMessage = `✅ Payment confirmed successfully.
Provider is on the way for your ${booking.service_title} service!`;

        let cleanNumber = userPhone.toString().replace(/[\+\-\s]/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      }
      
    } catch (err) {
      toast.error("Failed to update payment status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-slate-400">
        Booking not found.
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-slate-400">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Payment Screenshot</h2>
          <p className="text-slate-400">The customer has not submitted a payment screenshot yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Verify Payment</h1>
              <p className="text-slate-400 text-sm">Review the customer's screenshot</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <User className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Customer</p>
                <p className="text-white font-medium">{booking.customer_name}</p>
                <p className="text-slate-400 text-sm">{booking.phone_number || booking.phone}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Amount Due</p>
                <p className="text-2xl font-bold text-cyan-400">${payment.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  payment.payment_status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' :
                  payment.payment_status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {payment.payment_status}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">Payment Screenshot</p>
              <div className="rounded-2xl border-2 border-slate-700 overflow-hidden bg-slate-900">
                <img 
                  src={payment.screenshot_url} 
                  alt="Payment Proof" 
                  className="w-full h-auto object-contain max-h-96"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Image+Load+Error' }}
                />
              </div>
            </div>
          </div>

          {statusMessage ? (
             <div className="text-center p-6 bg-slate-900/80 border border-slate-700 rounded-2xl">
               <p className="text-lg font-bold text-white mb-2">{statusMessage}</p>
               <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
                 Close
               </button>
             </div>
          ) : payment.payment_status === 'Under Review' ? (
            <div className="flex gap-4">
              <button
                onClick={() => handleVerify('Rejected')}
                disabled={actionLoading}
                className="flex-1 py-4 bg-slate-800 border border-slate-700 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-300 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Reject
              </button>
              <button
                onClick={() => handleVerify('Verified')}
                disabled={actionLoading}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group"
              >
                {actionLoading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-slate-900/50 rounded-2xl">
              <p className="text-slate-400">This payment has already been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderPaymentVerify;
