import { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { 
  Briefcase, DollarSign, Calendar, Star, 
  CheckCircle, Clock, XCircle, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const ProviderDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    rating: 4.8
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get("/provider/stats"),
          api.get("/provider/bookings")
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Error fetching provider data", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/provider/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 opacity-80"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
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
          <div className="mb-8 flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-3 uppercase tracking-wider">
                Provider Portal
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">My Operations</h1>
              <p className="text-slate-400">Manage your assigned jobs and track your earnings.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Manage Schedule <Calendar className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { title: "Completed", value: stats.completedJobs, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { title: "Earnings", value: `$${stats.totalEarnings}`, icon: DollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                  { title: "Rating", value: stats.rating, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  </div>
                ))}
              </div>

              {/* Active Bookings List */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                  <h3 className="text-lg font-bold text-white">Assigned Bookings</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {bookings.map(booking => (
                    <div key={booking.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-6 justify-between items-center">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{booking.service_title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {new Date(booking.booking_date || booking.created_at).toLocaleDateString()}
                            <span className="mx-1">•</span> Client: {booking.customer_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                        <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start">
                          <span className="text-white font-bold">${booking.service_price}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                            booking.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                            booking.status === 'Accepted' ? 'bg-blue-500/20 text-blue-400' :
                            booking.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          {booking.status === 'Pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(booking.id, 'Accepted')} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors">Accept</button>
                              <button onClick={() => handleUpdateStatus(booking.id, 'Cancelled')} className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors">Reject</button>
                            </>
                          )}
                          {booking.status === 'Accepted' && (
                            <button onClick={() => handleUpdateStatus(booking.id, 'In Progress')} className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors">Start Job</button>
                          )}
                          {booking.status === 'In Progress' && (
                            <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">Mark Completed</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {bookings.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                      <p>No active assignments right now.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
