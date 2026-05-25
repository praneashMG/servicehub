import { useState, useContext } from "react";
import { X, Calendar, MapPin, Phone, User, FileText } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ service, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bookingDate: "",
    notes: ""
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        serviceId: service.id,
        name: formData.name,
        phone_number: formData.phone,
        address: formData.address,
        bookingDate: formData.bookingDate,
        notes: formData.notes,
        preferred_time: formData.bookingDate // use bookingDate as preferred time
      };

      const res = await api.post("/bookings", payload);
      toast.success("Booking Created!");
      
      setBookingResponse(res.data);
      setIsSuccess(true);
      toast.success("Booking Created Successfully!");
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppNotify = () => {
    const providerPhone = (bookingResponse && bookingResponse.provider_whatsapp) || (service && service.whatsapp_number);
    
    if (!providerPhone) {
      toast.error("No WhatsApp number found for this service.");
      onClose();
      navigate("/dashboard");
      return;
    }

    const confirmUrl = `${window.location.origin}/provider/confirm/${bookingResponse ? bookingResponse.id : ''}`;
    const whatsappMessage = `*New Booking Request*
    
*Customer:* ${formData.name}
*Service:* ${service.title}
*Phone:* ${formData.phone}
*Address:* ${formData.address}
${formData.notes ? `*Notes:* ${formData.notes}\n` : ''}
*Action Required:*
Please click the link below to *Confirm* (and select an ETA) or *Decline* this booking:
${confirmUrl}`;

    let cleanNumber = String(providerPhone).replace(/[\+\-\s]/g, '');
    if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    // Close modal and go to dashboard
    onClose();
    navigate("/dashboard");
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { onClose(); navigate("/dashboard"); }}></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Created!</h2>
          <p className="text-slate-400 mb-8">Your booking is pending. Please notify the service provider via WhatsApp to confirm an arrival time.</p>
          
          <button 
            onClick={handleWhatsAppNotify}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(16,185,129,0.3)] mb-4"
          >
            Notify Provider via WhatsApp
          </button>
          
          <button 
            onClick={() => { onClose(); navigate("/dashboard"); }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Skip for now (Go to Dashboard)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Book Service</h3>
            <p className="text-cyan-400 text-sm font-medium mt-1">{service.title} - ${service.price}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none h-24"
                  placeholder="123 Main St, Apt 4B, City, State"
                ></textarea>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="datetime-local" 
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Additional Notes (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none h-20"
                  placeholder="Any special instructions for the provider..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
