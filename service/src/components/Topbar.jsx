import { Search, Bell, Menu } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Topbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 w-full flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex flex-col">
          <h1 className="text-xl font-bold text-slate-100">
            Welcome Back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-slate-400">Here is what's happening with your bookings today.</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            className="bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-64"
          />
        </div>

        <NotificationBell />

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-200 font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-400">User Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
