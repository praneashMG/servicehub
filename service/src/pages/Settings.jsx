import { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Bell, Moon, Shield, Globe, Smartphone, X, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleRequestDeletion = async () => {
    setLoadingRequest(true);
    try {
      const res = await api.post("/auth/delete-request");
      toast.success(res.data.message);
      if (res.data.previewUrl) {
        // Output this for testing ease since we use Ethereal
        console.log("Email Preview URL:", res.data.previewUrl);
        toast("Check browser console for OTP Email link!", { icon: "📧" });
      }
      setIsOtpModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleConfirmDeletion = async (e) => {
    e.preventDefault();
    setLoadingConfirm(true);
    try {
      await api.post("/auth/delete-confirm", { otp });
      toast.success("Account deleted successfully.");
      setIsOtpModalOpen(false);
      logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP or failed to delete");
    } finally {
      setLoadingConfirm(false);
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Platform Settings</h1>
              <p className="text-slate-400">Customize your ServiceHub experience and preferences.</p>
            </div>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Save Changes
            </button>
          </div>

          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Smartphone className="w-5 h-5 text-blue-400" />
                App Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-start">
                    <Bell className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-slate-400 text-sm">Receive updates about your bookings</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-start">
                    <Moon className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-slate-400 text-sm">Toggle dark/light platform theme</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Globe className="w-5 h-5 text-emerald-400" />
                Localization
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Language</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors">
                    <option>English (US)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Timezone</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-slate-400 text-sm">
                  Permanently delete your account and all associated booking data. This action cannot be undone.
                </p>
                <button 
                  onClick={handleRequestDeletion}
                  disabled={loadingRequest}
                  className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 font-medium rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {loadingRequest ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : "Delete Account"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOtpModalOpen(false)}></div>
          
          <div className="relative bg-slate-900 border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Verify Deletion
              </h3>
              <button onClick={() => setIsOtpModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-300 text-sm mb-6">
                An email containing a 6-digit OTP has been sent to your registered email address. Please enter it below to confirm permanent account deletion.
              </p>
              <form onSubmit={handleConfirmDeletion}>
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block text-center">Enter OTP Code</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="------"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loadingConfirm || otp.length !== 6}
                  className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                >
                  {loadingConfirm ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Confirm Permanent Deletion"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
