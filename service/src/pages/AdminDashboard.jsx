import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import { 
  Users, BookOpen, DollarSign, Activity, 
  Settings, Tags, Wrench, CreditCard, 
  Bell, FileText, Trash2, Edit3, CheckCircle2, XCircle, Phone
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const AdminDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for edits
  const [editWalletId, setEditWalletId] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");

  const [editServiceId, setEditServiceId] = useState(null);
  const [serviceData, setServiceData] = useState({ title: "", price: "", category: "", image: "", whatsapp_number: "" });
  
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceData, setNewServiceData] = useState({ title: "", price: "", category: "", image: "", whatsapp_number: "" });


  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, bookingsRes, txRes, servicesRes, pendingRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/bookings"),
          api.get("/admin/transactions"),
          api.get("/admin/services"),
          api.get("/admin/payments/pending")
        ]);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
        setTransactions(txRes.data);
        setServices(servicesRes.data);
        setPendingPayments(pendingRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // --- USERS MANAGEMENT ---
  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : currentRole === 'user' ? 'provider' : 'admin';
    try {
      const res = await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: res.data.role } : u));
      toast.success(`User role updated to ${res.data.role}`);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateWallet = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/wallet`, { amount: walletAmount });
      setUsers(users.map(u => u.id === userId ? { ...u, wallet_balance: res.data.wallet_balance } : u));
      toast.success("Wallet updated");
      setEditWalletId(null);
    } catch (err) {
      toast.error("Failed to update wallet");
    }
  };

  // --- SERVICES MANAGEMENT ---
  const handleDeleteService = async (id) => {
    if(!window.confirm("Delete this service permanently?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      setServices(services.filter(s => s.id !== id));
      toast.success("Service deleted");
    } catch(err) {
      toast.error("Failed to delete service");
    }
  };

  const startEditService = (service) => {
    setEditServiceId(service.id);
    setServiceData({ title: service.title, price: service.price, category: service.category, image: service.image, whatsapp_number: service.whatsapp_number });
  };

  const handleUpdateService = async (id) => {
    try {
      const cleanData = {
        ...serviceData,
        price: String(serviceData.price).replace(/[^0-9.]/g, '')
      };
      const res = await api.put(`/admin/services/${id}`, cleanData);
      setServices(services.map(s => s.id === id ? res.data : s));
      toast.success("Service updated");
      setEditServiceId(null);
    } catch(err) {
      toast.error("Failed to update service");
    }
  };

  const handleCreateService = async () => {
    if (!newServiceData.title || !newServiceData.category || !newServiceData.price) {
      return toast.error("Please fill all required fields");
    }
    
    try {
      const cleanData = {
        ...newServiceData,
        price: String(newServiceData.price).replace(/[^0-9.]/g, '')
      };
      const res = await api.post(`/admin/services`, cleanData);
      setServices([res.data, ...services]);
      toast.success("Service created");
      setIsAddingService(false);
      setNewServiceData({ title: "", price: "", category: "", image: "", whatsapp_number: "" });
    } catch(err) {
      toast.error("Failed to create service");
    }
  };

  // --- PROVIDERS MANAGEMENT ---
  const handleDeleteProvider = async (id) => {
    if(!window.confirm("Delete this provider?")) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      setProviders(providers.filter(p => p.id !== id));
      toast.success("Provider deleted");
    } catch(err) {
      toast.error("Failed to delete provider");
    }
  };

  const startEditProvider = (provider) => {
    setEditProviderId(provider.id);
    setProviderData({ name: provider.name, whatsapp_number: provider.whatsapp_number });
  };

  const handleUpdateProvider = async (id) => {
    try {
      const res = await api.put(`/admin/providers/${id}`, providerData);
      setProviders(providers.map(p => p.id === id ? res.data : p));
      toast.success("Provider updated");
      setEditProviderId(null);
    } catch(err) {
      toast.error("Failed to update provider");
    }
  };

  const handleCreateProvider = async () => {
    if (!newProviderData.name || !newProviderData.whatsapp_number) {
      return toast.error("Please fill all required fields");
    }
    try {
      const res = await api.post(`/admin/providers`, newProviderData);
      setProviders([res.data, ...providers]);
      toast.success("Provider created");
      setIsAddingProvider(false);
      setNewProviderData({ name: "", whatsapp_number: "" });
    } catch(err) {
      toast.error("Failed to create provider");
    }
  };

  // --- BOOKINGS MANAGEMENT ---
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: res.data.status } : b));
      toast.success(`Booking marked as ${status}`);
    } catch(err) {
      toast.error("Failed to update booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    if(!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
      toast.success("Booking deleted");
    } catch(err) {
      toast.error("Failed to delete booking");
    }
  };

  // --- PAYMENT VERIFICATION ---
  const handleVerifyPayment = async (id, action) => {
    try {
      await api.put(`/admin/payments/${id}/verify`, { action });
      setPendingPayments(pendingPayments.filter(p => p.id !== id));
      toast.success(`Payment ${action.toLowerCase()} successfully`);
      
      if (action === 'Accept') {
        // Also update the local bookings state to show it's Paid
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Paid' } : b));
      }
    } catch(err) {
      toast.error(`Failed to ${action.toLowerCase()} payment`);
    }
  };

  // --- ANALYTICS DATA ---
  const totalRevenue = transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  
  // Mock chart data generation based on bookings
  const chartData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 18 },
    { name: 'Mar', revenue: 2000, bookings: 12 },
    { name: 'Apr', revenue: 2780, bookings: 30 },
    { name: 'May', revenue: totalRevenue, bookings: bookings.length },
  ];

  const { logout } = useContext(AuthContext);

  const adminModules = [
    { id: 'analytics', name: 'Analytics Panel', icon: <Activity className="w-5 h-5"/> },
    { id: 'payments', name: 'Payment Verification', icon: <CreditCard className="w-5 h-5"/> },
    { id: 'users', name: 'User Management', icon: <Users className="w-5 h-5"/> },
    { id: 'bookings', name: 'Bookings Manager', icon: <BookOpen className="w-5 h-5"/> },
    { id: 'services', name: 'Services Control', icon: <Wrench className="w-5 h-5"/> },
    { id: 'providers', name: 'Providers Control', icon: <Phone className="w-5 h-5"/> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 opacity-80"></div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      {/* Removed the main Sidebar to make the System Modules the only sidebar */}

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Admin Sub-Sidebar */}
          <div className="w-full md:w-64 bg-slate-900/50 border-r border-white/10 overflow-y-auto custom-scrollbar flex-shrink-0">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">System Modules</h2>
            </div>
            <nav className="p-4 space-y-1 flex-1">
              {adminModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeTab === mod.id 
                      ? 'bg-indigo-500/20 text-indigo-400 font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className={`${activeTab === mod.id ? 'text-indigo-400' : 'text-slate-500'}`}>{mod.icon}</div>
                  {mod.name}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10 mt-auto">
               <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-slate-400 hover:bg-red-500/10 hover:text-red-400 group">
                  <div className="text-slate-500 group-hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5"/></div>
                  Log Out
               </button>
            </div>
          </div>

          {/* Module Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto pb-20">
                
                {/* 1. ANALYTICS PANEL */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Analytics Overview</h2>
                      <p className="text-slate-400">Real-time performance metrics and growth charts.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6">
                        <p className="text-indigo-400 text-sm font-bold mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <p className="text-cyan-400 text-sm font-bold mb-1">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-white">{bookings.length}</h3>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <p className="text-emerald-400 text-sm font-bold mb-1">Active Users</p>
                        <h3 className="text-3xl font-bold text-white">{users.length}</h3>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <p className="text-pink-400 text-sm font-bold mb-1">Active Services</p>
                        <h3 className="text-3xl font-bold text-white">{services.length}</h3>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[400px]">
                      <h3 className="text-lg font-bold text-white mb-6">Revenue & Bookings Growth</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 2. USER MANAGEMENT */}
                {activeTab === 'users' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-white/5 text-xs uppercase font-bold text-slate-400">
                            <tr>
                              <th className="px-6 py-4">User</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Wallet Balance</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {users.map(u => (
                              <tr key={u.id} className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4">
                                  <p className="font-bold text-white">{u.name}</p>
                                  <p className="text-xs text-slate-500">{u.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <select 
                                    value={u.role} 
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-bold"
                                  >
                                    <option value="user">User</option>
                                    <option value="provider">Provider</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  {editWalletId === u.id ? (
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="number" 
                                        value={walletAmount}
                                        onChange={(e) => setWalletAmount(e.target.value)}
                                        className="w-20 bg-slate-900 border border-indigo-500 rounded px-2 py-1"
                                      />
                                      <button onClick={() => handleUpdateWallet(u.id)} className="text-emerald-400 hover:text-emerald-300"><CheckCircle2 className="w-4 h-4"/></button>
                                      <button onClick={() => setEditWalletId(null)} className="text-slate-400 hover:text-slate-300"><XCircle className="w-4 h-4"/></button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-cyan-400">${parseFloat(u.wallet_balance).toFixed(2)}</span>
                                      <button onClick={() => { setEditWalletId(u.id); setWalletAmount(u.wallet_balance); }} className="text-slate-500 hover:text-white"><Edit3 className="w-3 h-3"/></button>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 ml-auto transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BOOKINGS MANAGEMENT */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-3xl font-bold text-white mb-2">Bookings Manager</h2>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-white/5 text-xs uppercase font-bold text-slate-400">
                            <tr>
                              <th className="px-6 py-4">ID & Date</th>
                              <th className="px-6 py-4">Customer</th>
                              <th className="px-6 py-4">Service</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {bookings.map(b => (
                              <tr key={b.id} className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4">
                                  <p className="font-mono text-slate-400 text-xs mb-1">#{b.id.toString().padStart(6,'0')}</p>
                                  <p>{new Date(b.booking_date).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{b.user_name}</td>
                                <td className="px-6 py-4 text-cyan-400">{b.service_title}</td>
                                <td className="px-6 py-4">
                                  <select 
                                    value={b.status}
                                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                    className={`bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-bold ${b.status === 'Completed' ? 'text-emerald-400' : b.status === 'Cancelled' ? 'text-red-400' : 'text-yellow-400'}`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteBooking(b.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg inline-block transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SERVICES MANAGEMENT */}
                {activeTab === 'services' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-3xl font-bold text-white">Services Control</h2>
                      <button 
                        onClick={() => setIsAddingService(!isAddingService)}
                        className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                      >
                        {isAddingService ? "Cancel" : "+ Add Service"}
                      </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-white/5 text-xs uppercase font-bold text-slate-400">
                            <tr>
                              <th className="px-6 py-4">Service Details</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">WhatsApp No.</th>
                              <th className="px-6 py-4">Price</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {isAddingService && (
                              <tr className="bg-indigo-500/10">
                                <td className="px-6 py-4 space-y-2">
                                  <input placeholder="Title" value={newServiceData.title} onChange={(e) => setNewServiceData({...newServiceData, title: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-full" />
                                  <input placeholder="Image URL" value={newServiceData.image} onChange={(e) => setNewServiceData({...newServiceData, image: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-full text-xs text-slate-400" />
                                </td>
                                <td className="px-6 py-4">
                                  <input placeholder="Category" value={newServiceData.category} onChange={(e) => setNewServiceData({...newServiceData, category: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-24" />
                                </td>
                                <td className="px-6 py-4">
                                  <input placeholder="WhatsApp" value={newServiceData.whatsapp_number} onChange={(e) => setNewServiceData({...newServiceData, whatsapp_number: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-28" />
                                </td>
                                <td className="px-6 py-4">
                                  <input placeholder="Price" value={newServiceData.price} onChange={(e) => setNewServiceData({...newServiceData, price: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-20" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={handleCreateService} className="text-white font-bold bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg">Save</button>
                                </td>
                              </tr>
                            )}
                            {services.map(s => (
                              <tr key={s.id} className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4">
                                  {editServiceId === s.id ? (
                                    <div className="space-y-2">
                                      <input value={serviceData.title} onChange={(e) => setServiceData({...serviceData, title: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-full" />
                                      <input placeholder="Image URL" value={serviceData.image} onChange={(e) => setServiceData({...serviceData, image: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-full text-xs text-slate-400" />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <img src={s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                                      <p className="font-bold text-white">{s.title}</p>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {editServiceId === s.id ? (
                                    <input value={serviceData.category} onChange={(e) => setServiceData({...serviceData, category: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-24" />
                                  ) : (
                                    <span className="px-2 py-1 bg-white/5 rounded-lg text-xs">{s.category}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {editServiceId === s.id ? (
                                    <input value={serviceData.whatsapp_number || ''} onChange={(e) => setServiceData({...serviceData, whatsapp_number: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-28" />
                                  ) : (
                                    <span className="font-bold text-slate-300">{s.whatsapp_number}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {editServiceId === s.id ? (
                                    <input value={serviceData.price} onChange={(e) => setServiceData({...serviceData, price: e.target.value})} className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 w-20" />
                                  ) : (
                                    <span className="font-bold text-cyan-400">${s.price}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  {editServiceId === s.id ? (
                                    <>
                                      <button onClick={() => handleUpdateService(s.id)} className="text-emerald-400 p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-4 h-4"/></button>
                                      <button onClick={() => setEditServiceId(null)} className="text-slate-400 p-2 bg-slate-800 rounded-lg"><XCircle className="w-4 h-4"/></button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => startEditService(s)} className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 p-2 rounded-lg inline-block transition-colors"><Edit3 className="w-4 h-4" /></button>
                                      <button onClick={() => handleDeleteService(s.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg inline-block transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}


                {/* 5. PAYMENT VERIFICATION */}
                {activeTab === 'payments' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-3xl font-bold text-white">Payment Verification</h2>
                      <span className="bg-amber-500/20 text-amber-400 py-1 px-3 rounded-full text-sm font-bold border border-amber-500/30">
                        {pendingPayments.length} Pending
                      </span>
                    </div>
                    
                    {pendingPayments.length === 0 ? (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                        <p className="text-slate-400">There are no manual payments waiting for verification right now.</p>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-slate-400">
                              <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Screenshot & TX ID</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {pendingPayments.map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02]">
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-white">{p.user_name}</p>
                                    <p className="text-xs text-slate-500">{p.user_email}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-cyan-400">{p.service_title}</p>
                                    <p className="text-xs text-slate-500">Booking #{p.booking_id}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="font-bold text-white">${parseFloat(p.amount).toFixed(2)}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block w-fit">TX: {p.transaction_id}</span>
                                      <a href={p.screenshot_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs">
                                        <FileText className="w-3 h-3" /> View Screenshot
                                      </a>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                      onClick={() => handleVerifyPayment(p.id, 'Accept')}
                                      className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/80 px-4 py-2 rounded-lg font-bold transition-colors"
                                    >
                                      Accept
                                    </button>
                                    <button 
                                      onClick={() => handleVerifyPayment(p.id, 'Decline')}
                                      className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/80 px-4 py-2 rounded-lg font-bold transition-colors"
                                    >
                                      Decline
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
