import { useState, useContext, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Shield, Camera, Lock, X } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, updateUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user, isEditing]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be less than 5MB");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      
      const loadingToast = toast.loading("Uploading profile image...");
      try {
        const res = await api.put("/auth/profile", { profile_image: base64Image });
        updateUser({ profile_image: res.data.user.profile_image });
        toast.success("Profile image updated!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to upload image");
      } finally {
        toast.dismiss(loadingToast);
      }
    };
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", formData);
      updateUser(res.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    
    setLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password updated successfully!");
      setIsPasswordModalOpen(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-slate-100 mb-2">My Profile</h1>
            <p className="text-slate-400">Manage your personal information and account security.</p>
          </div>

          <div className="max-w-4xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
              <div className="absolute -bottom-12 left-8 flex items-end gap-5">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-300">
                    {user?.profile_image ? (
                      <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="text-lg font-bold text-white">Personal Information</h3>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-cyan-400 text-sm hover:underline"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                        <input 
                          type="text" required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                        <input 
                          type="email" required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Address</label>
                        <input 
                          type="text" 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <button 
                        type="submit" disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex justify-center"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save Changes"}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                          <User className="w-5 h-5 text-cyan-400" />
                          <span className="text-slate-200">{user?.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <span className="text-slate-200">{user?.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                          <span className="text-slate-200">{user?.phone || "Not set"}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Address</label>
                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                          <span className="text-slate-200">{user?.address || "Not set"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Security</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Account Role</label>
                      <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-slate-200 capitalize">{user?.role || 'User'} Account</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full py-3 mt-2 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-colors font-semibold"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
          
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Change Password
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Current Password</label>
                  <input 
                    type="password" required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">New Password</label>
                  <input 
                    type="password" required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Confirm New Password</label>
                  <input 
                    type="password" required
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex justify-center"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
