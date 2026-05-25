import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AlertCircle, CreditCard, QrCode, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const PaymentCard = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // 'Pending', 'Processing', 'Paid', 'PayAfter'

  const handlePayNow = () => {
    setIsExpanded(true);
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('Processing');
    setTimeout(() => {
      setPaymentStatus('Paid');
      toast.success(`Payment of $${booking.service_price} successful!`);
      setIsExpanded(false);
    }, 2000);
  };



  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/20">
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
            <img src={booking.service_image} alt={booking.service_title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{booking.service_title}</h3>
            <p className="text-slate-400 text-sm mb-2">Booked on {new Date(booking.created_at).toLocaleDateString()}</p>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
              Booking #{booking.id.toString().padStart(6, '0')}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <p className="text-3xl font-extrabold text-cyan-400 mb-4">${booking.service_price}</p>
          
          {paymentStatus === 'Paid' ? (
            <div className="flex items-center gap-2 text-emerald-400 font-bold px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
              Paid Successfully
            </div>
          ) : (
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={handlePayNow}
                className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable QR Code Section */}
      {isExpanded && paymentStatus === 'Pending' && (
        <div className="border-t border-white/10 bg-slate-950/50 p-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-lg font-bold text-white mb-2">Scan to Pay</h4>
          <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
            Scan this QR code with any UPI or Crypto payment app to complete your payment of <strong className="text-cyan-400">${booking.service_price}</strong> instantly.
          </p>
          
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-6">
            <img src="/qrcode.png" alt="Payment QR Code" className="w-48 h-48 rounded-lg" />
          </div>

          <button 
            onClick={handleSimulatePayment}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 w-full max-w-xs"
          >
            I have completed the payment
          </button>
          
          <button 
            onClick={() => setIsExpanded(false)}
            className="mt-4 text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            <ChevronUp className="w-4 h-4" />
            Close QR Code
          </button>
        </div>
      )}
    </div>
  );
};

const Payments = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my");
        const pendingBookings = res.data.filter(b => 
          b.status !== 'Paid' && 
          b.status !== 'Completed' && 
          b.status !== 'Cancelled'
        );
        setBookings(pendingBookings);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch pending payments");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 opacity-80"></div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>
      <div className="relative z-10 hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Pay For Services</h1>
            <p className="text-slate-400">View your booked services and choose how you'd like to pay.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-4xl">
              <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-red-400">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-white/5 border border-white/10 rounded-3xl max-w-4xl">
              You have no pending service payments.
            </div>
          ) : (
            <div className="max-w-4xl space-y-6">
              {bookings.map((booking) => (
                <PaymentCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payments;
