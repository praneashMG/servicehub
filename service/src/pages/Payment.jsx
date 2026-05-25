import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { ShieldCheck, CreditCard, CheckCircle2, ArrowLeft, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";
import UploadImage from "../components/UploadImage";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const [transactionId, setTransactionId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    if (location.state?.booking) {
      setBookingDetails(location.state.booking);
    } else {
      navigate('/bookings');
    }
  }, [location, navigate]);

  const handleManualPayment = async () => {
    if (!transactionId || !screenshotUrl) {
      return toast.error("Please provide both Transaction ID and Screenshot.");
    }
    
    setLoading(true);

    try {
      await api.post("/payments/manual", {
        booking_id: bookingDetails.id,
        amount: parseFloat(bookingDetails.price) + parseFloat(bookingDetails.price * 0.05),
        transaction_id: transactionId,
        screenshot_url: screenshotUrl
      });

      setSuccess(true);
      toast.success("Payment submitted for verification! 🎉");
      
      setTimeout(() => {
        navigate("/bookings");
      }, 3000);

    } catch (err) {
      console.error(err);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return null;

  const tax = (bookingDetails.price * 0.05).toFixed(2);
  const total = (parseFloat(bookingDetails.price) + parseFloat(tax)).toFixed(2);

  if (success) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center relative w-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="animate-in zoom-in-50 duration-500 bg-white/5 border border-amber-500/30 p-10 rounded-3xl backdrop-blur-xl flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.1)] relative z-10">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Under Review</h2>
          <p className="text-slate-400 mb-8 text-center max-w-sm">Your payment details have been submitted and are pending verification by an admin.</p>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite] w-full origin-left"></div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 font-sans relative w-full overflow-hidden antialiased">
      <Navbar />

      <div className="absolute top-0 right-1/4 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-0 w-[40rem] h-[40rem] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-20 container mx-auto px-6 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: Booking Summary */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm h-fit">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shrink-0">
                <img src={bookingDetails.service_image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070"} alt="Service" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-white font-bold">{bookingDetails.service_title || "Service Booking"}</h4>
                <p className="text-sm text-slate-400">Scheduled: {new Date(bookingDetails.booking_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">${parseFloat(bookingDetails.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Service Tax (5%)</span>
                <span className="text-white font-medium">${tax}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold text-lg">Total Due</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                ${total}
              </span>
            </div>
          </div>

          {/* RIGHT: Manual Payment Submission */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" /> Manual Payment
            </h3>
            <p className="text-sm text-slate-400 mb-8">Scan the QR code below and submit your payment details for verification.</p>

            <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col items-center justify-center border-4 border-slate-800/50">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=servicehub@bank&pn=ServiceHub&am=100.00&cu=INR" alt="UPI QR Code" className="w-40 h-40 mb-4" />
              <p className="text-slate-900 font-bold text-sm">UPI: servicehub@bank</p>
              <p className="text-slate-500 text-xs">Scan using any UPI app</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Transaction / UTR ID</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., 203819283748"
                  />
                </div>
              </div>

              <div>
                <UploadImage onUploadSuccess={(url) => setScreenshotUrl(url)} label="Payment Screenshot" />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Your service will be confirmed once an admin verifies the payment details. Fake or incorrect screenshots will lead to account suspension.
                </p>
              </div>

              <button 
                onClick={handleManualPayment}
                disabled={loading || !screenshotUrl || !transactionId}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>Submit Payment for Review</>
                )}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Payment;
