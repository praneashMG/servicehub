import { useState, useEffect, useRef } from "react";
import { Bell, Check, Clock } from "lucide-react";
import api from "../services/api";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.is_read).length);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    
    // Fallback mock data if API fails or hasn't started yet
    setTimeout(() => {
      if (notifications.length === 0) {
        const mockNotifs = [
          { id: 1, title: "Booking Confirmed", message: "Your AC Repair booking was accepted.", is_read: false, created_at: new Date().toISOString() },
          { id: 2, title: "Payment Successful", message: "Receipt for $49.99 has been generated.", is_read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
        ];
        setNotifications(mockNotifs);
        setUnreadCount(1);
      }
    }, 1500);

    fetchNotifications();

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.is_read) handleMarkAsRead(n.id);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-blue-500/[0.02]' : ''}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="shrink-0 mt-1">
                      {notif.is_read ? (
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
