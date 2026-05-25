import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Upload, CheckCircle2, QrCode, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const PayNow = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!file) return toast.error("Please select a screenshot to upload");
    setUploading(true);
    
    try {
      // 1. Upload image to /api/upload
      const formData = new FormData();
      formData.append("image", file);
      
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const screenshotUrl = uploadRes.data.url;

      // 2. Submit manual payment to /api/payments/manual
      await api.post("/payments/manual", {
        booking_id: bookingId,
        amount: booking.service_price,
        transaction_id: `txn_${Date.now()}`,
        screenshot_url: screenshotUrl
      });
      
      // 3. Update booking status
      await api.put(`/bookings/${bookingId}/user-status`, { status: 'Payment Submitted', payment_method: 'Pay Now' });

      setSubmitted(true);
      
      // 4. Notify provider via WhatsApp
      if (booking.provider_whatsapp) {
        const verifyUrl = `${window.location.origin}/provider/payment/${booking.id}`;
        const whatsappMessage = `Customer submitted payment screenshot.
Booking ID: #${booking.id}
Amount: $${booking.service_price}

Verify Payment:
${verifyUrl}`;

        let cleanNumber = String(booking.provider_whatsapp).replace(/[\+\-\s]/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to process payment submission");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!booking) return null;

  // Generate a generic UPI link for demonstration
  const upiLink = `upi://pay?pa=provider@upi&pn=ServiceHub&am=${booking.service_price}&cu=INR`;

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h2>
          <p className="text-slate-400 mb-8">Your screenshot has been sent to the provider for verification.</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Complete Payment</h1>
        <p className="text-slate-400 mb-6">Pay for {booking.service_title}</p>

        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-8 text-center">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-cyan-400">${booking.service_price}</p>
        </div>

        <div className="space-y-6">
          <a 
            href={upiLink}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Pay via GPay / UPI
          </a>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">After payment</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Upload Screenshot</label>
            <div className="border-2 border-dashed border-slate-600 hover:border-cyan-500/50 rounded-2xl p-6 text-center transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                id="screenshot" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="screenshot" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-slate-300 font-medium">
                  {file ? file.name : "Click to select image"}
                </span>
                <span className="text-xs text-slate-500">JPG, PNG up to 5MB</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleUploadAndSubmit}
            disabled={uploading || !file}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-900 rounded-2xl font-bold transition-all flex justify-center items-center"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Submit Verification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayNow;
