import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Users, Star, ShieldCheck, Clock, MapPin, 
  Briefcase, Sparkles, Heart, ArrowRight, Search, 
  CheckCircle, ChevronDown, Wrench, Droplet, Bolt,
  MonitorSmartphone, Camera, Car, SlidersHorizontal, X, MessageSquare
} from "lucide-react";

// Mock Data
const categories = [
  { id: 1, name: "Plumbing Experts", icon: <Droplet className="w-5 h-5" />, count: "124 Providers", slug: "plumbing" },
  { id: 2, name: "Electricians", icon: <Bolt className="w-5 h-5" />, count: "89 Providers", slug: "electrical" },
  { id: 3, name: "Beauty Specialists", icon: <Sparkles className="w-5 h-5" />, count: "156 Providers", slug: "beauty" },
  { id: 4, name: "Fitness Trainers", icon: <Users className="w-5 h-5" />, count: "210 Providers", slug: "fitness" },
  { id: 5, name: "Developers", icon: <MonitorSmartphone className="w-5 h-5" />, count: "45 Providers", slug: "development" },
  { id: 6, name: "Painters", icon: <Briefcase className="w-5 h-5" />, count: "67 Providers", slug: "painters" },
  { id: 7, name: "Car Mechanics", icon: <Car className="w-5 h-5" />, count: "92 Providers", slug: "mechanics" },
  { id: 8, name: "Cleaning Pros", icon: <Sparkles className="w-5 h-5" />, count: "180 Providers", slug: "cleaning" },
];

const providers = [
  {
    id: 1,
    name: "John Carter",
    specialty: "HVAC Specialist",
    category: "mechanics",
    avatar: "https://i.pravatar.cc/150?u=john",
    price: 55,
    rating: 4.9,
    reviews: 128,
    jobs: 340,
    experience: "10 Years",
    response: "Within 15 mins",
    status: "Available Today",
    statusColor: "bg-emerald-500",
    location: "New York, NY",
    about: "Certified HVAC specialist with over a decade of experience in residential and commercial cooling systems. Specializing in eco-friendly setups.",
    skills: ["AC Repair", "Heating", "Ventilation"]
  },
  {
    id: 2,
    name: "Sarah Davis",
    specialty: "Master Electrician",
    category: "electrical",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    price: 75,
    rating: 4.8,
    reviews: 256,
    jobs: 890,
    experience: "12 Years",
    response: "Within 5 mins",
    status: "Busy",
    statusColor: "bg-amber-500",
    location: "Brooklyn, NY",
    about: "Fully licensed master electrician. I handle everything from simple fixture installations to complete home rewiring and smart home integration.",
    skills: ["Wiring", "Smart Home", "Lighting"]
  },
  {
    id: 3,
    name: "Mike Wilson",
    specialty: "Plumbing Expert",
    category: "plumbing",
    avatar: "https://i.pravatar.cc/150?u=mike",
    price: 65,
    rating: 5.0,
    reviews: 89,
    jobs: 420,
    experience: "8 Years",
    response: "Within 30 mins",
    status: "Available Tomorrow",
    statusColor: "bg-blue-500",
    location: "Queens, NY",
    about: "Emergency plumbing expert. Water heaters, leak detection, and pipe repairs. Available 24/7 for urgent calls.",
    skills: ["Pipe Repair", "Water Heaters", "Emergencies"]
  },
  {
    id: 4,
    name: "Alex Chen",
    specialty: "Full Stack Developer",
    category: "development",
    avatar: "https://i.pravatar.cc/150?u=alex",
    price: 95,
    rating: 4.9,
    reviews: 167,
    jobs: 210,
    experience: "6 Years",
    response: "Within 1 hour",
    status: "Accepting Projects",
    statusColor: "bg-emerald-500",
    location: "Remote",
    about: "Building scalable web and mobile applications for startups. Proficient in React, Node.js, and cloud architecture.",
    skills: ["React", "Node.js", "AWS"]
  }
];

const testimonials = [
  {
    id: 1,
    name: "Jessica Lee",
    hired: "John Carter",
    review: "John is an absolute lifesaver. Our AC broke during the hottest day of the year, and he had it fixed within an hour of arriving.",
    avatar: "https://i.pravatar.cc/150?u=jess",
    rating: 5
  },
  {
    id: 2,
    name: "Mark Johnson",
    hired: "Alex Chen",
    review: "Alex built my startup's MVP in record time. His communication is excellent and the code quality is top-notch. Highly recommend.",
    avatar: "https://i.pravatar.cc/150?u=mark",
    rating: 5
  },
  {
    id: 3,
    name: "Amanda White",
    hired: "Sarah Davis",
    review: "Sarah upgraded our entire electrical panel and installed EV chargers. Professional, on-time, and extremely knowledgeable.",
    avatar: "https://i.pravatar.cc/150?u=amanda",
    rating: 5
  }
];

const faqs = [
  {
    q: "How are providers verified?",
    a: "Every provider undergoes a rigorous 4-step verification process: identity check, criminal background screen, professional license verification, and a practical skills assessment."
  },
  {
    q: "Can I contact providers directly?",
    a: "Once you create a free account, you can use our secure in-app messaging system to discuss your project details with any provider before hiring them."
  },
  {
    q: "Are payments secure?",
    a: "Yes! Your payment is held securely in escrow by ServiceHub and is only released to the provider once you confirm the job has been completed to your satisfaction."
  },
  {
    q: "How do ratings work?",
    a: "Only verified customers who have actually hired and paid a provider through ServiceHub can leave a review. This ensures all ratings are 100% authentic and trustworthy."
  }
];

const Providers = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useContext(AuthContext);

  const handleAction = () => {
    navigate(user ? '/services' : '/login');
  };

  // Real layout state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(100);
  const [favorites, setFavorites] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // Live filter computation
  const filteredProviders = useMemo(() => {
    return providers.filter(prov => {
      const matchesSearch = prov.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prov.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prov.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || prov.category === selectedCategory;
      const matchesLocation = prov.location.toLowerCase().includes(locationQuery.toLowerCase());
      const matchesPrice = prov.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [searchQuery, selectedCategory, locationQuery, maxPrice]);

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans relative w-full overflow-hidden antialiased">
      <Navbar />

      {/* Modern Background Blur Mesh */}
      <div className="absolute top-0 right-1/4 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[25%] left-0 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 pt-24">
        
        {/* HERO HEADER SECTION */}
        <section className="container mx-auto px-6 pt-12 pb-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Curated Professional Talent
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                Find & Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Elite Experts</span>
              </h1>
              <p className="text-slate-400 max-w-2xl text-base">
                Skip the guesswork. Connect directly with fully vetted, highly top-rated professionals verified for guaranteed satisfaction.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button onClick={handleAction} className="px-5 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all duration-200">
                Become a Partner
              </button>
              <button onClick={handleAction} className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 transition-all duration-200 flex items-center gap-2">
                Post A Custom Request <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* BROWSE BY CATEGORY CHIPS */}
        <section className="container mx-auto px-6 max-w-7xl mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular Sectors</h3>
            <span className="text-xs text-blue-400 font-semibold">{categories.length} core industries</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat.slug)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 text-center border group ${
                    isSelected 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`mb-2.5 p-2 rounded-xl transition-colors ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold block truncate w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* MAIN CONTROLS & MARKETPLACE SPLIT VIEW */}
        <section className="container mx-auto px-6 max-w-7xl mb-24">
          <div className="flex gap-8 items-start">
            
            {/* DESKTOP SIDEBAR FILTERS */}
            <aside className="w-64 hidden lg:flex flex-col gap-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 sticky top-24 shrink-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" /> Filter Criteria
                </span>
                {(searchQuery || selectedCategory !== "all" || locationQuery || maxPrice !== 100) && (
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setLocationQuery(""); setMaxPrice(100); }} 
                    className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Search input inside filters */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Keyword Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. AC Repair, React..." 
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Specialty Select Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Core Specialty</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="all">All Specialties</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="development">Development</option>
                  <option value="mechanics">Car Mechanics</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Geographic Bounds</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City or Remote" 
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-400">Max Budget Rate</label>
                  <span className="text-blue-400 font-bold">${maxPrice}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="120" 
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer opacity-80 hover:opacity-100"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                  <span>$40/hr</span>
                  <span>$120/hr</span>
                </div>
              </div>
            </aside>

            {/* MAIN DATA LISTINGS INTERFACE */}
            <div className="flex-1 w-full">
              
              {/* Dynamic Header Counter & Mobile Filter Opener */}
              <div className="flex items-center justify-between mb-6 bg-slate-900/20 border border-slate-800/50 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-slate-400">
                  Showing <span className="text-white font-bold">{filteredProviders.length}</span> verified match{filteredProviders.length !== 1 && 'es'} based on conditions
                </p>
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-xs font-bold px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Configure
                </button>
              </div>

              {/* EMPTY STATE */}
              {filteredProviders.length === 0 && (
                <div className="text-center py-20 bg-slate-900/10 border border-slate-800/60 border-dashed rounded-3xl p-8">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4">
                    <Search className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">No matching professionals found</h4>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">We couldn't find matches matching those filter bounds. Try expanding your parameters or resetting constraints.</p>
                  <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setLocationQuery(""); setMaxPrice(100); }} className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold">
                    Clear Workspace Settings
                  </button>
                </div>
              )}

              {/* PROVIDERS GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProviders.map((prov) => (
                  <div 
                    key={prov.id} 
                    className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 hover:bg-slate-900/50 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    {/* Header Row */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img src={prov.avatar} alt={prov.name} className="w-14 h-14 rounded-full border-2 border-slate-800 object-cover" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 ${prov.statusColor} border-2 border-[#020617] rounded-full`} title={prov.status} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{prov.name}</h3>
                              <ShieldCheck className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{prov.specialty}</p>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => toggleFavorite(prov.id, e)} 
                          className={`p-2 rounded-xl border transition-colors ${favorites.includes(prov.id) ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(prov.id) ? 'fill-red-400' : ''}`} />
                        </button>
                      </div>

                      {/* Micro Stats Banner */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-950/40 border border-slate-800/60 p-2 rounded-xl mb-4 text-center">
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Rating</p>
                          <p className="text-xs font-bold text-white flex items-center gap-1 justify-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {prov.rating}
                          </p>
                        </div>
                        <div className="border-x border-slate-800/60">
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Volume</p>
                          <p className="text-xs font-bold text-white">{prov.jobs} jobs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Exp</p>
                          <p className="text-xs font-bold text-white">{prov.experience}</p>
                        </div>
                      </div>

                      {/* Brief Bio Paragraph */}
                      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                        "{prov.about}"
                      </p>

                      {/* Tag list */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {prov.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-slate-950 border border-slate-800/80 text-slate-400 text-[11px] rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Lower Card Action Section */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Hourly Quote</p>
                        <p className="text-lg font-black text-white">${prov.price}.00<span className="text-xs text-slate-500 font-normal">/hr</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleAction} className="p-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors" title="Message Provider">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button onClick={handleAction} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/5 transition-all duration-200">
                          Secure Hire
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* MOBILE SIDEBAR MODAL OVERLAY */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
            <div className="w-80 h-full bg-[#020617] border-l border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm"><SlidersHorizontal className="w-4 h-4" /> Filter Options</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Search Keywords</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or service tags..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Industry Sector</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                  <option value="all">All Specialties</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="development">Development</option>
                  <option value="mechanics">Car Mechanics</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Target Location</label>
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="e.g. Remote" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-400">Max Budget</label>
                  <span className="text-blue-400 font-bold">${maxPrice}/hr</span>
                </div>
                <input type="range" min="40" max="120" step="5" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-500 cursor-pointer" />
              </div>

              <button onClick={() => setMobileFiltersOpen(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl mt-auto shadow-lg shadow-blue-500/10">
                Apply Search Parameters
              </button>
            </div>
          </div>
        )}

        {/* TRUSTED BY NUMBERS BANNER */}
        <section className="container mx-auto px-6 max-w-7xl mb-24">
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-sm">
            <div>
              <h4 className="text-3xl font-black text-white mb-1">500+</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Vetted Providers</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">10K+</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Deliveries</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">98%</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Customer Approval</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">24/7</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Escrow Safety Vault</p>
            </div>
          </div>
        </section>

        {/* PLATFORM METRICS/DIFFERENTIATOR STANDARD */}
        <section className="container mx-auto px-6 max-w-7xl mb-24">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800/80 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">The ServiceHub Standard</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm">We maintain premium safeguards. Every relationship structured across our network operates under strict protection rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { title: "Identity & Asset Cleared", desc: "Background verification, identity validation, and credential audits are performed continuously.", icon: <ShieldCheck className="w-5 h-5"/> },
                { title: "Interactive Workspace Chats", desc: "Engage, map scopes, negotiate target parameters, and send code review notes prior to payment.", icon: <Users className="w-5 h-5"/> },
                { title: "Milestone Escrow Protection", desc: "Funds sit safely buffered until tasks clear your expectations and gain formal completion confirmation.", icon: <CheckCircle className="w-5 h-5"/> }
              ].map((ft, i) => (
                <div key={i} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                    {ft.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{ft.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{ft.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL FEEDBACK CAROUSEL */}
        <section className="container mx-auto px-6 max-w-7xl mb-24">
          <h2 className="text-2xl font-extrabold text-white mb-2 text-center">Validated Case Studies</h2>
          <p className="text-slate-400 text-center text-sm mb-10">Real project outcomes recorded directly via smart system tracking.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(test => (
              <div key={test.id} className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Verified Engagement: {test.hired}</span>
                  </div>
                  <div className="flex text-yellow-400 gap-0.5 mb-3">
                    {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic mb-6">"{test.review}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                  <img src={test.avatar} alt={test.name} className="w-8 h-8 rounded-full" />
                  <h4 className="text-white text-xs font-bold">{test.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPREHENSIVE FAQ SYSTEM */}
        <section className="container mx-auto px-6 mb-24 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-2 text-center">Frequently Asked Queries</h2>
          <p className="text-slate-400 text-center text-sm mb-10">Everything you need to know about processing safe matches on the network.</p>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/80 rounded-xl overflow-hidden transition-colors hover:border-slate-700">
                <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-5 text-left focus:outline-none">
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-5 overflow-hidden transition-all duration-200 ${openFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800/50 pt-3">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION CONSOLE */}
        <section className="container mx-auto px-6 max-w-7xl mb-20">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-white mb-3">Ready to dispatch a task?</h2>
              <p className="text-sm text-slate-400 mb-8">Deploy resources today. Connect with real talent instantly or build an account profiles to accept client milestones.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-bold transition-transform duration-200">
                  Find an Expert Now
                </button>
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-transform duration-200">
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Providers;