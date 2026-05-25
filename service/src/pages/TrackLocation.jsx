import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, MapPin, Truck, Phone } from "lucide-react";
import toast from "react-hot-toast";

const TrackLocation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll for booking updates every 5 seconds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch location", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!booking) return null;

  const hasLocation = booking.provider_lat && booking.provider_lng;
  const position = hasLocation ? [parseFloat(booking.provider_lat), parseFloat(booking.provider_lng)] : [0, 0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center selection:bg-cyan-500/30">
      <div className="max-w-4xl w-full">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Truck className="w-6 h-6 text-cyan-400" />
                Live Tracking
              </h1>
              <p className="text-slate-400 text-sm mt-1">Booking #{booking.id} - {booking.service_title}</p>
            </div>
            
            {booking.provider_whatsapp && (
               <a 
                 href={`https://wa.me/${String(booking.provider_whatsapp).replace(/[\+\-\s]/g, '')}`}
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl font-medium transition-colors"
               >
                 <Phone className="w-4 h-4" />
                 Contact Provider
               </a>
            )}
          </div>

          <div className="h-[500px] w-full bg-slate-900 relative">
            {!hasLocation ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10 bg-slate-900/80">
                <MapPin className="w-12 h-12 mb-3 text-slate-600 animate-pulse" />
                <p className="text-lg font-medium text-slate-400">Waiting for provider to share location...</p>
                <p className="text-sm mt-2">The map will automatically update once they start their journey.</p>
              </div>
            ) : (
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${position[1]-0.005},${position[0]-0.005},${position[1]+0.005},${position[0]+0.005}&layer=mapnik&marker=${position[0]},${position[1]}`} 
                style={{ border: 0, zIndex: 1, filter: 'invert(90%) hue-rotate(180deg)' }}
                title="Provider Location"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackLocation;
