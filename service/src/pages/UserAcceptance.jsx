import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { Check, X, Clock, MapPin, CreditCard, ArrowRight, Phone, User, Settings } from "lucide-react";
import toast from "react-hot-toast";

const UserAcceptance = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAccepting = location.pathname.includes('/accept');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleDecline = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/user-status`, { status: 'Cancelled' });
      setBooking({ ...booking, status: 'Cancelled' });
      setStatusMessage("You have cancelled this booking.");
      
      // Notify provider via WhatsApp
      if (booking.provider_whatsapp) {
        const whatsappMessage = `❌ Customer cancelled the booking.
Booking ID: #${booking.id}
Service: ${booking.service_title}`;

        let cleanNumber = String(booking.provider_whatsapp).replace(/[\+\-\s]/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      }
    } catch (err) {
      toast.error("Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayAfter = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/user-status`, { status: 'Payment Pending', payment_method: 'Pay After' });
      setBooking({ ...booking, status: 'Payment Pending' });
      setStatusMessage("You have selected Pay After Service.");
      
      // Notify provider via WhatsApp
      if (booking.provider_whatsapp) {
        const completeUrl = `${window.location.origin}/provider/complete/${booking.id}`;
        const whatsappMessage = `Customer selected Pay After Service.
Booking ID: #${booking.id}
Service: ${booking.service_title}

*Action Required (After Service):*
When you have finished the work, click here to request payment:
${completeUrl}`;

        let cleanNumber = String(booking.provider_whatsapp).replace(/[\+\-\s]/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      }
    } catch (err) {
      toast.error("Failed to set payment method");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/user-status`, { status: 'User Accepted' });
      setBooking({ ...booking, status: 'User Accepted' });
      setShowPaymentSelection(true);
    } catch (err) {
      toast.error("Failed to accept booking");
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

  // If already processed or the user is looking at the decline route
  if (statusMessage) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${statusMessage.includes('Pay After') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {statusMessage.includes('Pay After') ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{statusMessage}</h2>
          <p className="text-slate-400 mb-8">The service provider has been notified.</p>
          
          <div className="space-y-4">
            {statusMessage.includes('Pay After') && (
              <button 
                onClick={() => navigate(`/booking/track/${booking.id}`)} 
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_10px_25px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Track Provider Location
              </button>
            )}
            <button onClick={() => navigate('/')} className="w-full px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentSelection) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Payment Selection</h2>
          <p className="text-slate-400 mb-8">Please choose how you would like to pay for {booking.service_title}.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate(`/payment/now/${booking.id}`)}
              className="w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(6,182,212,0.3)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                <span className="text-lg">Pay Now</span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={handlePayAfter}
              disabled={actionLoading}
              className="w-full p-4 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white rounded-2xl font-bold transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                {actionLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Clock className="w-6 h-6" />}
                <span className="text-lg">Pay After Service</span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Provider Confirmed!</h1>
          <p className="text-slate-400 mb-8">
            The service provider has confirmed your booking and selected an ETA.
          </p>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Service</p>
            <p className="text-white font-medium mb-4">{booking.service_title}</p>
            
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Arrival Time</p>
            <p className="text-cyan-400 font-bold text-xl">{booking.arrival_time || "Not specified"}</p>
          </div>

          {isAccepting ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Do you want to proceed?</h3>
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex justify-center items-center"
              >
                {actionLoading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : "Accept & Proceed to Payment"}
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 text-slate-400 hover:text-white font-medium"
              >
                Decide Later
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Are you sure you want to decline?</h3>
              <button
                onClick={handleDecline}
                disabled={actionLoading}
                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl font-bold transition-all flex justify-center items-center"
              >
                {actionLoading ? <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : "Yes, Decline Booking"}
              </button>
              <button
                onClick={() => navigate(`/booking/accept/${booking.id}`)}
                className="w-full py-3 text-slate-400 hover:text-white font-medium"
              >
                No, I want to accept
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAcceptance;
