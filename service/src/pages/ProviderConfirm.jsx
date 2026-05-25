import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Check, X, Clock, MapPin, Phone, User, Settings } from "lucide-react";
import toast from "react-hot-toast";

const ProviderConfirm = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("1 Hour");
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

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
      await api.put(`/bookings/${bookingId}/decline`);
      setBooking({ ...booking, status: 'Cancelled' });
      setStatusMessage("Booking declined successfully.");
    } catch (err) {
      toast.error("Failed to decline booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/confirm`, { arrival_time: arrivalTime });
      setBooking({ ...booking, status: 'Confirmed', arrival_time: arrivalTime });
      setStatusMessage("Booking confirmed successfully!");
      
      // WhatsApp Click-to-Chat back to User
      const userPhone = booking.phone_number || booking.phone;
      if (userPhone) {
        const reviewUrl = `${window.location.origin}/booking/accept/${bookingId}`;
        const whatsappMessage = `✅ Your booking has been confirmed.
Provider will arrive in ${arrivalTime}.
Do you want to proceed?

*Action Required:*
Please click the link below to Accept or Decline:
${reviewUrl}`;

        // Clean the number (remove +, spaces, dashes)
        let cleanNumber = userPhone.toString().replace(/[\+\-\s]/g, '');
        
        // If it's a 10 digit Indian number, prefix with 91
        if (cleanNumber.length === 10) {
          cleanNumber = '91' + cleanNumber;
        }

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
                Click here to send WhatsApp to User
              </a>
            </div>
          ), { duration: 10000 });
        }
      }
      setIsConfirming(false);
    } catch (err) {
      toast.error("Failed to confirm booking");
    } finally {
      setActionLoading(false);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    toast.success("Attempting to start location tracking...");

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported. Starting Mock GPS...");
      startMockTracking();
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await api.put(`/bookings/${bookingId}/location`, { lat: latitude, lng: longitude });
        } catch (err) {
          console.error("Failed to update location", err);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Real GPS failed (Check Windows settings). Starting Mock GPS for demo...");
        startMockTracking();
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    setWatchId(id);
  };

  const startMockTracking = () => {
    // Starting coordinates (e.g., somewhere in Erode based on previous tests)
    let currentLat = 11.0168;
    let currentLng = 76.9558;
    
    // Clear any existing watch
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    toast.success("Mock GPS Stream Started");
    
    // Simulate driving by slightly changing coordinates every 5 seconds
    const intervalId = setInterval(async () => {
      currentLat += 0.0005; // Move slightly North
      currentLng += 0.0005; // Move slightly East
      try {
        await api.put(`/bookings/${bookingId}/location`, { lat: currentLat, lng: currentLng });
      } catch (err) {
        console.error("Failed to update mock location", err);
      }
    }, 5000);
    
    // We store the interval ID in the watchId state so it gets cleared on unmount
    setWatchId(intervalId);
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        // Handle both clearWatch (real) and clearInterval (mock)
        if (typeof watchId === 'number' && watchId > 1000) {
           clearInterval(watchId);
        } else {
           navigator.geolocation.clearWatch(watchId);
        }
      }
    };
  }, [watchId]);

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

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <Settings className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Booking Request</h1>
              <p className="text-slate-400 text-sm">Please review and confirm</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <User className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Customer</p>
                <p className="text-white font-medium">{booking.customer_name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <Settings className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Service</p>
                <p className="text-white font-medium">{booking.service_title}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <Phone className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Phone</p>
                <p className="text-white font-medium">{booking.phone_number || booking.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <MapPin className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Address</p>
                <p className="text-white font-medium">{booking.address || "Not provided"}</p>
              </div>
            </div>
            
            {booking.notes && (
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Notes</p>
                <p className="text-slate-300 text-sm italic">"{booking.notes}"</p>
              </div>
            )}
          </div>

          {statusMessage ? (
             <div className="text-center space-y-6">
               <div className="p-6 bg-slate-900/80 border border-slate-700 rounded-2xl">
                 <p className="text-lg font-bold text-white mb-2">{statusMessage}</p>
                 <p className="text-slate-400 text-sm">Status: <span className={booking.status === 'Confirmed' ? 'text-emerald-400' : 'text-red-400'}>{booking.status}</span></p>
               </div>
               
               {booking.status === 'Confirmed' && (
                 <button
                   onClick={isTracking ? () => {} : startTracking}
                   disabled={isTracking}
                   className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                     isTracking 
                       ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                       : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)]'
                   }`}
                 >
                   <MapPin className={`w-5 h-5 ${isTracking ? 'animate-bounce' : ''}`} />
                   {isTracking ? "Live Tracking Active" : "Start Journey & Share Location"}
                 </button>
               )}
             </div>
          ) : isConfirming ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Arrival Time</label>
              <div className="grid grid-cols-2 gap-3">
                {["1 Hour", "2 Hours", "3 Hours", "4 Hours"].map(time => (
                  <button
                    key={time}
                    onClick={() => setArrivalTime(time)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${arrivalTime === time ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex justify-center items-center"
                >
                  {actionLoading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : "Send Confirmation"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleDecline}
                disabled={actionLoading}
                className="flex-1 py-4 bg-slate-800 border border-slate-700 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-300 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Decline
              </button>
              <button
                onClick={() => setIsConfirming(true)}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
              >
                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderConfirm;
