import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BookingCard from "../components/BookingCard";
import api from "../services/api";
import { AlertCircle, CalendarX2 } from "lucide-react";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">My Bookings</h1>
            <p className="text-slate-400">Manage and track all your scheduled service appointments.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-red-400">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <CalendarX2 className="w-10 h-10 text-cyan-400 opacity-80" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No bookings yet</h2>
              <p className="text-slate-400 max-w-sm text-center mb-6">
                You haven't booked any services yet. Explore our services and schedule your first appointment!
              </p>
              <button 
                onClick={() => window.location.href = '/services'}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
