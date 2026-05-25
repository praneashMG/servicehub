import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCard from "../components/DashboardCard";
import ServiceCard from "../components/ServiceCard";
import api from "../services/api";
import { 
  CalendarDays, 
  Briefcase, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeServices: 0,
    pendingRequests: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, statsRes, favsRes] = await Promise.all([
          api.get("/bookings/my"),
          api.get("/stats"),
          api.get("/favorites")
        ]);
        setRecentBookings(bookingsRes.data.slice(0, 4)); // Only top 4 recent
        setStats(statsRes.data);
        setFavorites(favsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      subtitle: "Compared to last month",
      trend: 12,
      icon: CalendarDays,
      colorClass: { bg: "bg-blue-500", text: "text-blue-400", bgLight: "bg-blue-500" }
    },
    {
      title: "Active Services",
      value: stats.activeServices.toString(),
      subtitle: "Compared to last month",
      trend: 5,
      icon: Briefcase,
      colorClass: { bg: "bg-cyan-500", text: "text-cyan-400", bgLight: "bg-cyan-500" }
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests.toString(),
      subtitle: "Needs your attention",
      trend: -2,
      icon: Clock,
      colorClass: { bg: "bg-amber-500", text: "text-amber-400", bgLight: "bg-amber-500" }
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      subtitle: "Compared to last month",
      trend: 8,
      icon: CheckCircle,
      colorClass: { bg: "bg-emerald-500", text: "text-emerald-400", bgLight: "bg-emerald-500" }
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 opacity-80"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="relative z-10 hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <DashboardCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Dashboard Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Recent Bookings Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Recent Bookings</h2>
                <button 
                  onClick={() => window.location.href = '/my-bookings'}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  View All →
                </button>
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
              ) : recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-slate-400 text-sm">No recent bookings found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <img src={booking.service_image} alt={booking.service_title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-white font-medium">{booking.service_title}</h4>
                          <p className="text-slate-400 text-xs">{new Date(booking.booking_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : booking.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {booking.status}
                        </div>
                        {booking.status === 'Confirmed' && booking.arrival_time && (
                          <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            Arriving in {booking.arrival_time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Services Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Favorite Services</h2>
                <button 
                  onClick={() => window.location.href = '/services'}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  Explore More →
                </button>
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
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-slate-400 text-sm">No favorite services yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.slice(0, 4).map((service) => (
                    <ServiceCard key={service.favorite_id} service={service} isFavorite={true} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;