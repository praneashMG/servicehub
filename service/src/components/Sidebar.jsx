import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Search, 
  CalendarCheck, 
  LogOut, 
  CreditCard,
  Settings,
  User,
  ShieldAlert,
  Home,
  Briefcase,
  Sparkles
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Back to Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Find Services", path: "/services", icon: <Search className="w-5 h-5" /> },
    { name: "My Bookings", path: "/bookings", icon: <CalendarCheck className="w-5 h-5" /> },
    { name: "Payments", path: "/payments", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { name: "Back to Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Admin Panel", path: "/admin", icon: <ShieldAlert className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const providerLinks = [
    { name: "Back to Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Provider Dashboard", path: "/provider/dashboard", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Payments", path: "/payments", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const linksToRender = user?.role === 'admin' ? adminLinks : user?.role === 'provider' ? providerLinks : navLinks;

  return (
    <div className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col pt-8 pb-6 px-4">
      <div className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0 px-2 mb-12">
        <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
            Service<span className="text-blue-400">Hub</span>
            {user?.role === 'admin' && <span className="text-xs text-indigo-400 uppercase tracking-widest ml-2">Admin</span>}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {linksToRender.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? user?.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 font-semibold' : 'bg-cyan-500/10 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={`${isActive ? (user?.role === 'admin' ? 'text-indigo-400' : 'text-cyan-400') : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                {link.icon}
              </div>
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
