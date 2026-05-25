import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Users,
  Check,
  Percent,
  TrendingUp,
  Globe,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client', // 'client' or 'provider'
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLength: false,
    hasNumber: false,
    hasSpecial: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const pass = formData.password;
    const checks = {
      hasLength: pass.length >= 8,
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[^A-Za-z0-9]/.test(pass)
    };

    let score = 0;
    if (checks.hasLength) score += 1;
    if (checks.hasNumber) score += 1;
    if (checks.hasSpecial) score += 1;

    setPasswordStrength({
      score,
      ...checks
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setRole = (roleType) => {
    setFormData(prev => ({ ...prev, role: roleType }));
    toast.success(`Role set to ${roleType === 'client' ? 'Service Seeker' : 'Service Professional'}`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'A secure password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms of service';
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
    
    setLoading(true);
    
    try {
      const response = await fetch('http://https://servicehub-sknv.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account provisioned successfully! Please sign in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const socialSignup = (provider) => {
    toast.success(`Initiating secure gateway credential mapping for ${provider}...`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container Layout */}
      <div className="relative w-full max-w-6xl z-10 grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {}
        <div className="lg:col-span-7 w-full">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-6 relative">
            
            {/* Ambient inner glow header line */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            {/* Header Content */}
            <div className="text-center sm:text-left space-y-2">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0 mb-2">
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
                Create Your Account
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Get started today by configuring your operations node.
              </p>
            </div>

            {}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  formData.role === 'client' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                I want to book
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  formData.role === 'provider' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                I want to provide
              </button>
            </div>

            {}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => socialSignup('Google')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold"
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
                onClick={() => socialSignup('GitHub')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-[#0c1226] text-[10px] tracking-widest font-bold text-slate-500 uppercase">
                Direct Provision Secure Gate
              </span>
            </div>

            {}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Full Identification Name
                </label>
                <div className="relative group">
                  <User className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                    errors.name ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'
                  }`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-500/60 focus:ring-red-500/40' 
                        : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                    }`}
                    placeholder="Enter your legal first & last name"
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Access Email Address
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
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500/60 focus:ring-red-500/40' 
                        : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                    }`}
                    placeholder="name@organization.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.email}</p>
                )}
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Secure Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                      errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'
                    }`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                        errors.password 
                          ? 'border-red-500/60 focus:ring-red-500/40' 
                          : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                      }`}
                      placeholder="At least 8 chars"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Re-verify Security Pass
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                      errors.confirmPassword ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'
                    }`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 text-xs transition-all duration-200 ${
                        errors.confirmPassword 
                          ? 'border-red-500/60 focus:ring-red-500/40' 
                          : 'border-slate-800/80 focus:ring-blue-500/50 focus:border-slate-700'
                      }`}
                      placeholder="Match security pass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.confirmPassword}</p>
                  )}
                </div>

              </div>

              {}
              {formData.password && (
                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wide">Strength Evaluator</span>
                    <span className={`px-2 py-0.5 rounded ${
                      passwordStrength.score === 3 ? 'text-emerald-400 bg-emerald-500/10' :
                      passwordStrength.score === 2 ? 'text-amber-400 bg-amber-500/10' :
                      'text-red-400 bg-red-500/10'
                    }`}>
                      {passwordStrength.score === 3 ? 'Strong secure' : passwordStrength.score === 2 ? 'Moderate' : 'Unsafe'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1">
                    {[1, 2, 3].map((val) => (
                      <div 
                        key={val} 
                        className={`h-full rounded-full transition-all duration-300 ${
                          passwordStrength.score >= val 
                            ? (passwordStrength.score === 3 ? 'bg-emerald-500' : passwordStrength.score === 2 ? 'bg-amber-500' : 'bg-red-500') 
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasLength ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                      8+ characters
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                      Includes numbers
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasSpecial ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                      Special character
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="space-y-1 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors selection:bg-transparent">
                    I acknowledge and consent to the ServiceHub platform <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and cryptographic escrow <a href="#" className="text-blue-400 hover:underline">Guidelines</a>.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-[10px] text-red-400 font-medium animate-fadeIn">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Submit Registration button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Provisioning Nodes...
                  </>
                ) : (
                  <>
                    Complete Register Setup
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Prompt */}
            <p className="text-center text-xs text-slate-500">
              Already registered on ServiceHub?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign In Instead
              </Link>
            </p>

          </div>
        </div>

        {}
        <div className="hidden lg:block lg:col-span-5 space-y-8">
          
          {/* Animated Interactive visual card container */}
          <div className="bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
            
            {/* Pulsing Visual Orbit Dynamic Graphic */}
            <div className="flex justify-center mb-8 relative">
              <div className="w-44 h-44 rounded-full border border-slate-800 flex items-center justify-center relative animate-spin [animation-duration:15s]">
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full top-2 left-1/2 transform -translate-x-1/2 shadow-[0_0_15px_#3b82f6]" />
                <div className="absolute w-2 h-2 bg-purple-400 rounded-full bottom-6 left-6 shadow-[0_0_10px_#c084fc]" />
                <div className="w-28 h-28 rounded-full border border-slate-800/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center">
                    {formData.role === 'client' ? (
                      <Users className="w-6 h-6 text-blue-400 animate-pulse" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-purple-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content swaps dynamically based on user's active role state selection! */}
            {formData.role === 'client' ? (
              <div className="space-y-4 text-center animate-fadeIn">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Access Premium Service Pros
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Join our decentralized node of fully validated, insured experts. Unlock live vehicle telemetry tracking, instant quotes, and risk-free automated escrow payouts.
                </p>

                {/* Performance indicators */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-850 text-center">
                  <div>
                    <p className="text-base font-bold text-white">45 Mins</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Response Time</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">100%</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Vetted Contractors</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center animate-fadeIn">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Maximize Professional Revenue
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Earn on your terms. Connect your calendar, receive optimized local route dispatches, and secure instant payment releases with no transaction dispute issues.
                </p>

                {/* Performance indicators for providers */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-850 text-center">
                  <div>
                    <p className="text-base font-bold text-emerald-400">0%</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Intro Platform Fees</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Weekly</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Escrow Payout Cycles</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Secure Infrastructure Footnote */}
          <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-900 px-5 py-3.5 rounded-2xl">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Fully Verified Security Specs</p>
              <p className="text-[10px] text-slate-500">ServiceHub uses military-grade end-to-end escrow encryptions.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;