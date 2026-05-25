import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CheckCircle, AlertCircle, CalendarClock, Hammer } from "lucide-react";
import toast from "react-hot-toast";

const ProviderComplete = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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

  const handleCompleteJob = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/provider-status`, { status: 'Service Completed' });
      setIsCompleted(true);
      
      // WhatsApp Click-to-Chat back to User
      const userPhone = booking.phone_number || booking.phone;
      if (userPhone) {
        const payUrl = `${window.location.origin}/payment/now/${bookingId}`;
        const whatsappMessage = `✅ Your service is complete!
Provider has marked the work for ${booking.service_title} as finished.

*Action Required:*
Please proceed to make your payment here:
${payUrl}`;

        // Clean the number (remove +, spaces, dashes)
        let cleanNumber = String(userPhone).replace(/[\+\-\s]/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

        const newWindow = window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-sm">Popup blocked by your browser!</span>
              <a 
                href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded text-center"
                onClick={() => toast.dismiss(t.id)}
              >
                Click here to request payment from User
              </a>
            </div>
          ), { duration: 15000 });
        }
      }
    } catch (err) {
      toast.error("Failed to mark job as complete");
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
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-slate-400 flex-col gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p>Booking not found.</p>
      </div>
    );
  }

  if (isCompleted || booking.status === 'Service Completed') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Job Marked as Finished!</h2>
          <p className="text-slate-400 mb-8">The customer has been notified to proceed with the payment.</p>
          <button onClick={() => navigate('/')} className="w-full px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-colors">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Hammer className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Service Completion</h1>
          <p className="text-slate-400 mb-8">
            Please mark the job as finished once you have completed the service.
          </p>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Customer</p>
              <p className="text-white font-medium">{booking.customer_name}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Service</p>
                <p className="text-cyan-400 font-bold">{booking.service_title}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Amount Due</p>
                <p className="text-emerald-400 font-bold">${booking.service_price}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex items-start gap-3">
                <CalendarClock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-300">Address: <span className="text-white">{booking.address}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCompleteJob}
              disabled={actionLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(6,182,212,0.3)] flex justify-center items-center"
            >
              {actionLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Mark Job as Finished & Request Payment"}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-slate-400 hover:text-white font-medium"
            >
              Not Finished Yet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderComplete;
