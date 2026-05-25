import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Security password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        login(data, data.token);
        
        toast.success('Authenticated successfully. Welcome back to ServiceHub!');
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setFormData({
      email: 'demo@servicehub.com',
      password: 'demo123'
    });
    setErrors({});
    toast.success('Demo credentials loaded. Click Sign In to continue!');
  };

  const socialLogin = (provider) => {
    toast.success(`Redirecting to secure gateway for ${provider}...`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Structural Grid */}
      <div className="relative w-full max-w-6xl z-10 grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {}
        <div className="lg:col-span-6 w-full">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8 relative">
            
            {/* Ambient inner glow header line */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            {/* Platform Identification Header */}
            <div className="text-center sm:text-left space-y-2">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0 mb-4">
                <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
                    Service<span className="text-blue-400">Hub</span>
                  </span>
                </div>
              </Link>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Enter your details to coordinate and manage your field dispatches.
              </p>
            </div>

            {/* Social Authentication Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => socialLogin('Google')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-850 text-slate-300 hover:text-white transition-all text-xs font-semibold"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => socialLogin('GitHub')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-850 text-slate-300 hover:text-white transition-all text-xs font-semibold"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-[#0c1226] text-[10px] tracking-widest font-bold text-slate-500 uppercase">
                Secure Mail Gate
              </span>
            </div>

            {}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Access Email
                </label>
                <div className="relative group">
                  <Mail className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                    errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500/60 focus:ring-red-500/40' 
                        : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                    }`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot Key?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                    errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-500/60 focus:ring-red-500/40' 
                        : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.password}</p>
                )}
              </div>

              {/* Remember Me and Preferences */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors selection:bg-transparent">
                    Lock authorization session
                  </span>
                </label>
              </div>

              {/* Submit Authentication */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Request Secure Access
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {}
            <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Demo Auto-fill Engine
                </div>
                <button
                  type="button"
                  onClick={autofillDemo}
                  className="text-[10px] font-bold text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 px-2.5 py-1 rounded-lg hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-md active:scale-95"
                >
                  Load Credentials
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-600 font-bold">Mail Account</span>
                  <span className="text-slate-400">demo@servicehub.com</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-600 font-bold">Security Pass</span>
                  <span className="text-slate-400">demo123</span>
                </div>
              </div>
            </div>

            {/* SignUp Prompt */}
            <p className="text-center text-xs text-slate-500">
              New operator in the dispatch circle?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Initiate Account Setup
              </Link>
            </p>

          </div>
        </div>

        {}
        <div className="hidden lg:block lg:col-span-6 space-y-8">
          
          {/* Animated Interactive Dashboard visual card */}
          <div className="bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
            
            {/* Pulsing Visual Orbit Graphic */}
            <div className="flex justify-center mb-8 relative">
              <div className="w-48 h-48 rounded-full border border-slate-800/80 flex items-center justify-center relative animate-spin [animation-duration:12s]">
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full top-2 left-1/2 transform -translate-x-1/2 shadow-[0_0_15px_#3b82f6]" />
                <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full bottom-8 left-4 shadow-[0_0_10px_#22d3ee]" />
                <div className="w-32 h-32 rounded-full border border-slate-800/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Global Operations Center
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Securely authenticate to review automated client contracts, real-time GPS fleet coordinate telemetry, and lock payouts within verified escrow circuits.
              </p>
            </div>

            {/* Operational Metrics inside sidebar */}
            <div className="grid grid-cols-3 gap-3 pt-8 border-t border-slate-850 mt-8 text-center">
              <div>
                <p className="text-lg font-bold text-white">45 Mins</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Response Mean</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">100%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Security Audited</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">98.4%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Rating Score</p>
              </div>
            </div>

          </div>

          {/* Secure Infrastructure Footnote */}
          <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-5 py-3 rounded-2xl">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Encrypted Cryptographic Escrow</p>
              <p className="text-[10px] text-slate-500">Every dispatch session is verified end-to-end via SHA-256 protocols.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;