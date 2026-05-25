import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Wrench,
  Droplet,
  Bolt,
  Sparkles,
  Paintbrush,
  Scissors,
  Car,
  Tv,
  CheckCircle,
  ShieldCheck,
  Zap,
  CreditCard,
  MapPin,
  Clock,
  Headphones,
  Star,
  ArrowRight,
  Mail,
  Lock,
  Compass
} from "lucide-react";

const STATS = [
  { value: "15,000+", label: "Verified Bookings", icon: CheckCircle, color: "text-emerald-400" },
  { value: "98.4%", label: "Satisfaction Rate", icon: Star, color: "text-amber-400" },
  { value: "45 Mins", label: "Average Response Time", icon: Clock, color: "text-cyan-400" },
  { value: "500+", label: "Expert Professionals", icon: ShieldCheck, color: "text-blue-400" }
];

const SERVICES = [
  { icon: Tv, title: "AC & HVAC Repair", desc: "Complete diagnostic checkups, filter upgrades, and premium eco-friendly deep cooling cleanings.", price: "$49", color: "from-cyan-500/20 to-blue-500/10" },
  { icon: Droplet, title: "Smart Plumbing", desc: "Emergency leak handling, high-tech camera inspections, and modern premium fixtures.", price: "$39", color: "from-blue-500/20 to-indigo-500/10" },
  { icon: Bolt, title: "Electrical Power", desc: "Smart thermostat setups, diagnostic testing, and reliable clean power routing systems.", price: "$39", color: "from-amber-500/20 to-orange-500/10" },
  { icon: Sparkles, title: "Premium Cleaning", desc: "Intensive sanitization, detailed home scrubbing, and chemical-free premium cleaning options.", price: "$59", color: "from-purple-500/20 to-pink-500/10" },
  { icon: Paintbrush, title: "Sleek Accent Painting", desc: "Flawless wall texturing, master coat paintings, and customized architectural layout updates.", price: "$199", color: "from-emerald-500/20 to-teal-500/10" },
  { icon: Scissors, title: "Wellness & Grooming", desc: "High-end hair restoration, facial treatments, and certified massage therapy delivered directly.", price: "$45", color: "from-rose-500/20 to-pink-500/10" }
];

const STEPS = [
  { step: "01", title: "Select Service", desc: "Browse our premium portfolio and dynamically lock in your transparent flat-rate quote instantly." },
  { step: "02", title: "Secure Escrow Matching", desc: "Automated matchmaking instantly dispatches an elite, verified expert local to your zip code." },
  { step: "03", title: "Approve Resolution", desc: "Funds are released to the professional only when you digitize and approve your project sign-off." }
];

const FEATURES = [
  { icon: ShieldCheck, title: "Criminal & Skill Vetting", desc: "Every single contractor undergoes background verification and real-world skill trials before entering our ecosystem.", color: "text-emerald-400 bg-emerald-500/10" },
  { icon: Lock, title: "Escrow Locked Payments", desc: "Rest assured knowing your payments are secure. No upfront cash; payouts transfer only when you are 100% satisfied.", color: "text-indigo-400 bg-indigo-500/10" },
  { icon: Compass, title: "Live GPS Fleet Tracking", desc: "Track precisely where your technician is. Receive real-time arrival estimates and dynamic route progression updates.", color: "text-cyan-400 bg-cyan-500/10" },
  { icon: Headphones, title: "24/7 Priority Concierge", desc: "A dedicated operations team watches over your bookings and handles any support questions in under 2 minutes.", color: "text-pink-400 bg-pink-500/10" }
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleBookNow = () => {
    navigate(user ? '/serv' : '/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 relative w-full overflow-hidden">

      {/* Background radial overlays for a premium SaaS feel */}
      <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] bg-gradient-to-br from-blue-600/10 to-indigo-500/0 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[80rem] right-10 w-[35rem] h-[35rem] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-24 left-1/3 w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Reusable Premium Navbar */}
      <Navbar />

      {/* --- SECTION 1: HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-28 sm:pt-32 pb-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Hero Content Side */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-md max-w-fit mx-auto lg:mx-0">

  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />

  <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-cyan-200 uppercase leading-none">
    Premium On-Demand Contracting
  </span>

</div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Book Trusted Services <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Instantly & On-Demand
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Find fully verified, background-checked professionals for HVAC repairs, electrical engineering, advanced sanitizing, and custom property maintenance—all bound by secure escrow guarantees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button onClick={handleBookNow} className="group relative w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">Book Service <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                </button>
                <Link to="/providers" className="w-full sm:w-auto flex justify-center items-center px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-300">
                  Find Professional
                </Link>
            </div>

            {/* Verification highlights under CTA */}
            <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-500" /> 100% Background Screened
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4.5 h-4.5 text-cyan-500" /> Upfront Custom Estimator
              </div>
            </div>
          </div>

          {/* Hero App/Dashboard Visualization */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />

            {/* Live mockup window frame */}
            <div className="relative bg-slate-900/50 border border-slate-800/80 p-5 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[10px] text-slate-500 tracking-wider">servicehub.io/console</div>
                <div className="w-3" />
              </div>

              {/* Booking tracker app design */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Scheduled Visit</p>
                      <h4 className="text-sm font-semibold text-white">Smart Home HVAC Restoration</h4>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Technician Assigned</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3.5 border-t border-slate-900 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px]">Estimated Arrival</p>
                      <p className="text-slate-200 font-medium mt-0.5">Today, 2:30 PM</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Security Pin</p>
                      <p className="text-cyan-400 font-bold mt-0.5">SH-8420</p>
                    </div>
                  </div>
                </div>

                {/* Micro stat meters */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl">
                    <p className="text-[10px] text-slate-500">Escrow Protected Funds</p>
                    <p className="text-base font-bold text-white mt-1">$450.00</p>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl">
                    <p className="text-[10px] text-slate-500">Satisfied Project Scale</p>
                    <p className="text-base font-bold text-white mt-1">24 Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Ratings Card widget */}
        

          </div>
        </div>
      </section>

      {/* --- SECTION 2: STATS / TRUST SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900/50 to-slate-950 border border-slate-900/80 rounded-3xl p-8 backdrop-blur-xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="text-center space-y-2 group">
                <div className={`mx-auto w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- SECTION 3: SERVICES SECTION --- */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Popular Services</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Highly structured operational flows tailored to deliver absolute safety, flat pricing, and transparent results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-900/20 border border-slate-900 hover:border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-blue-500/5 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Background glow hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-6 border-t border-slate-900/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Standard Unit Rate</p>
                    <p className="text-sm font-extrabold text-white">{svc.price}</p>
                  </div>
                  <button onClick={handleBookNow} className="text-xs font-semibold text-blue-400 group-hover:text-white flex items-center gap-1.5 bg-blue-500/5 group-hover:bg-blue-600 px-3.5 py-2 rounded-xl border border-blue-500/10 group-hover:border-transparent transition-all duration-300">
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- SECTION 4: HOW IT WORKS --- */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">How ServiceHub Works</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Transition from an unexpected domestic issue to an expert engineering dispatch solution in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative group bg-slate-950/40 border border-slate-900 p-6 rounded-2xl hover:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-extrabold text-blue-500 tracking-wider bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10">STEP {step.step}</span>
                <span className="text-4xl font-black text-slate-900 group-hover:text-blue-900/20 transition-colors select-none">{step.step}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 5: WHY CHOOSE US --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 sm:py-28 border-t border-slate-900/60">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Visual Text Matrix Anchor */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Safety and Integrity Crafted into Every Work Order
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              We removed guesswork from contracting. ServiceHub mandates comprehensive identity checks, background screens, and escrow safety policies for all projects.
            </p>
            <div className="pt-2">
              <Link to="/serv" className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Explore platform safety protocols <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Detailed Features Quad-Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">{feat.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- SECTION 6: CTA SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-10 md:p-16 text-center overflow-hidden shadow-2xl">

          {/* Minimal grid system details overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-slate-950/20 backdrop-blur-[1px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Experience Zero-Friction Booking?
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Book within minutes, monitor incoming expert location mappings live, and confirm payment dispatch only when you sign off.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/serv" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-xl transition-all duration-200 active:scale-95 text-center text-sm">
                Get Started
              </Link>
              <Link to="/serv" className="w-full sm:w-auto bg-slate-950/40 hover:bg-slate-950/60 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200 text-center text-sm">
                View Process
              </Link>
            </div>
          </div>
        </div>
      </section>
<Footer />

    </div>
  );
}