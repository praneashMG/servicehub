import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Wrench, Bolt, Sparkles, ShieldCheck, 
  Star, Clock, MapPin, ArrowRight, 
  Heart, Search, Users, Droplet, CheckCircle,
  Briefcase, Camera, MonitorSmartphone, Car,
  ChevronDown
} from "lucide-react";

// Mock Data
const categories = [
  { id: 1, name: "Plumbing", icon: <Droplet />, count: "124 Experts" },
  { id: 2, name: "Electrical", icon: <Bolt />, count: "89 Experts" },
  { id: 3, name: "AC Repair", icon: <Wrench />, count: "156 Experts" },
  { id: 4, name: "Home Cleaning", icon: <Sparkles />, count: "210 Experts" },
  { id: 5, name: "Web Development", icon: <MonitorSmartphone />, count: "45 Experts" },
  { id: 6, name: "Photography", icon: <Camera />, count: "67 Experts" },
  { id: 7, name: "Car Wash", icon: <Car />, count: "92 Experts" },
  { id: 8, name: "Fitness Trainer", icon: <Users />, count: "34 Experts" },
];

const services = [
  {
    id: 1,
    title: "Premium AC Installation & Repair",
    provider: "John Smith",
    avatar: "https://i.pravatar.cc/150?u=john",
    price: "$49.99/hr",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    location: "New York, NY",
    arrival: "25 mins"
  },
  {
    id: 2,
    title: "Deep Home Cleaning Service",
    provider: "Sarah Davis",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    price: "$35.00/hr",
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    location: "Brooklyn, NY",
    arrival: "45 mins"
  },
  {
    id: 3,
    title: "Emergency Electrical Repair",
    provider: "Mike Wilson",
    avatar: "https://i.pravatar.cc/150?u=mike",
    price: "$65.00/hr",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    location: "Queens, NY",
    arrival: "15 mins"
  },
  {
    id: 4,
    title: "Full Stack Web Development",
    provider: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?u=alex",
    price: "$85.00/hr",
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    location: "Remote",
    arrival: "Available Now"
  }
];

const providers = [
  {
    id: 1,
    name: "David Miller",
    skill: "Master Plumber",
    avatar: "https://i.pravatar.cc/150?u=david",
    experience: "12 Years",
    rating: 4.9,
    jobs: 845,
    response: "< 5 mins"
  },
  {
    id: 2,
    name: "Emily Clark",
    skill: "Interior Painter",
    avatar: "https://i.pravatar.cc/150?u=emily",
    experience: "8 Years",
    rating: 4.8,
    jobs: 432,
    response: "< 10 mins"
  },
  {
    id: 3,
    name: "Robert Taylor",
    skill: "Appliance Technician",
    avatar: "https://i.pravatar.cc/150?u=robert",
    experience: "15 Years",
    rating: 5.0,
    jobs: 1205,
    response: "< 15 mins"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Jessica Lee",
    review: "Absolutely incredible service. The technician arrived in 15 minutes and fixed my AC right before the heatwave hit. The app made it so easy to track his arrival!",
    avatar: "https://i.pravatar.cc/150?u=jess",
    rating: 5
  },
  {
    id: 2,
    name: "Mark Johnson",
    review: "I've hired web developers on other platforms, but the talent on ServiceHub is next level. Fast, communicative, and extremely professional.",
    avatar: "https://i.pravatar.cc/150?u=mark",
    rating: 5
  },
  {
    id: 3,
    name: "Amanda White",
    review: "The transparent pricing is what sold me. No hidden fees, just upfront costs and verified experts. I use this for all my home maintenance now.",
    avatar: "https://i.pravatar.cc/150?u=amanda",
    rating: 4
  }
];

const faqs = [
  {
    q: "How does the booking process work?",
    a: "Simply browse or search for a service, select a verified expert, pick a time that works for you, and confirm your booking. You can track your provider's arrival in real-time."
  },
  {
    q: "Are all service providers verified?",
    a: "Yes! Every single provider undergoes a rigorous background check, skill verification, and identity confirmation before they are allowed on our platform."
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. We use bank-level encryption for all transactions. Payment is securely held and only released to the provider once you confirm the job is completed to your satisfaction."
  },
  {
    q: "What is your cancellation policy?",
    a: "You can cancel any booking for free up to 2 hours before the scheduled time. Cancellations within 2 hours may be subject to a small cancellation fee."
  }
];

const Serv = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useContext(AuthContext);

  const handleAction = () => {
    navigate(user ? '/services' : '/login');
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-cyan-500/30 font-sans relative w-full overflow-hidden">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-10 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/3 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 pt-24 pb-20">
        
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 py-16 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" /> Trusted Service Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
            Book Verified Professionals Instantly
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Explore trusted experts for home services, beauty, repairs, development, fitness, and more. Transparent pricing and real-time tracking included.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <button onClick={handleAction} className="px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Explore Services <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleAction} className="px-8 py-4 w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl font-bold hover:-translate-y-1 transition-all duration-300">
              Become a Provider
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 border-t border-slate-800 pt-10 animate-fade-in-up animation-delay-400">
            <div>
              <h4 className="text-4xl font-bold text-white mb-1">10K+</h4>
              <p className="text-slate-500 text-sm font-medium">Happy Customers</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white mb-1">500+</h4>
              <p className="text-slate-500 text-sm font-medium">Verified Experts</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white mb-1">98%</h4>
              <p className="text-slate-500 text-sm font-medium">Satisfaction Rate</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white mb-1">24/7</h4>
              <p className="text-slate-500 text-sm font-medium">Support Available</p>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER SECTION */}
        <section className="sticky top-20 z-40 container mx-auto px-6 mb-24">
          <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-3 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input type="text" placeholder="What service do you need?" className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500" />
            </div>
            <div className="hidden md:block w-px h-8 bg-slate-800"></div>
            <div className="flex-1 flex items-center gap-3 px-4 w-full border-t md:border-none border-slate-800 pt-3 md:pt-0">
              <MapPin className="w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Your Location" className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500" />
            </div>
            <button onClick={handleAction} className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-colors">
              Search
            </button>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="container mx-auto px-6 mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-slate-400">Find exactly what you need from our top categories.</p>
            </div>
            <button onClick={handleAction} className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="group p-6 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl backdrop-blur-sm cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] transition-all duration-300">
                <div className="w-14 h-14 bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR SERVICES SECTION */}
        <section className="container mx-auto px-6 mb-24 relative">
           {/* Mini Tracker Card Decoration */}
           <div className="absolute -top-10 -right-4 hidden lg:flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-bounce" style={{animationDuration: '3s'}}>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold">Technician Assigned</p>
                <p className="text-sm text-white font-bold">Arriving in 22 mins</p>
              </div>
           </div>

          <h2 className="text-3xl font-bold text-white mb-2">Popular Services</h2>
          <p className="text-slate-400 mb-10">Highly rated services trending in your area.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((srv) => (
              <div key={srv.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={srv.image} alt={srv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button className="absolute top-4 right-4 p-2 bg-slate-900/50 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> {srv.arrival}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white leading-tight">{srv.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <img src={srv.avatar} alt={srv.provider} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-slate-400">{srv.provider}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 ml-auto" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{srv.rating}</span>
                      <span>({srv.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {srv.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-slate-500">Starting at</p>
                      <p className="text-xl font-bold text-cyan-400">{srv.price}</p>
                    </div>
                    <button onClick={handleAction} className="px-5 py-2 bg-slate-800 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING STEPS */}
        <section className="container mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-slate-400">Your desired service in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-slate-800 z-0"></div>
            
            {[
              { num: "01", title: "Search Service", desc: "Find what you need instantly." },
              { num: "02", title: "Choose Expert", desc: "Compare profiles & ratings." },
              { num: "03", title: "Book Appointment", desc: "Pick a time that works for you." },
              { num: "04", title: "Get It Done", desc: "Track arrival and pay securely." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-900 border-2 border-slate-800 group-hover:border-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-xl transition-colors duration-300">
                  <span className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROVIDERS */}
        <section className="container mx-auto px-6 mb-24">
          <h2 className="text-3xl font-bold text-white mb-2">Featured Experts</h2>
          <p className="text-slate-400 mb-10">Hire the top-rated professionals in your city.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {providers.map((prov) => (
              <div key={prov.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-300 text-center">
                <div className="relative inline-block mb-4">
                  <img src={prov.avatar} alt={prov.name} className="w-24 h-24 rounded-full border-4 border-slate-800 object-cover" />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{prov.name}</h3>
                <p className="text-blue-400 font-medium mb-4">{prov.skill}</p>

                <div className="flex justify-center gap-6 text-sm text-slate-300 mb-6">
                  <div className="text-center">
                    <p className="font-bold text-white flex items-center justify-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/> {prov.rating}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">{prov.jobs}</p>
                    <p className="text-xs text-slate-500">Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">{prov.experience}</p>
                    <p className="text-xs text-slate-500">Exp.</p>
                  </div>
                </div>

                <button onClick={handleAction} className="w-full py-3 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-transparent rounded-xl text-white font-bold transition-colors">
                  Hire Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="container mx-auto px-6 mb-24">
          <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px]" />
            
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose ServiceHub?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">We provide the most secure, transparent, and efficient way to book local services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {[
                { title: "Verified Experts", desc: "Every provider passes background checks and skills testing.", icon: <ShieldCheck className="w-6 h-6"/> },
                { title: "Secure Payments", desc: "Payments are held securely and released only upon satisfaction.", icon: <CheckCircle className="w-6 h-6"/> },
                { title: "Real-Time Tracking", desc: "Track your provider's live location straight to your door.", icon: <MapPin className="w-6 h-6"/> }
              ].map((ft, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                    {ft.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{ft.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{ft.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-6 mb-24">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Loved by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(test => (
              <div key={test.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl relative">
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 italic">"{test.review}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border-2 border-slate-700" />
                  <div>
                    <h4 className="text-white font-bold">{test.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400"/> Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="container mx-auto px-6 mb-32 max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                  <span className="text-lg font-bold text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Book Trusted Services?</h2>
              <p className="text-xl text-blue-200 mb-10">Join thousands of users who have transformed the way they find and book local experts.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={handleAction} className="px-8 py-4 bg-white text-blue-900 hover:bg-cyan-50 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all duration-300">
                  Explore Services Now
                </button>
                <button onClick={handleAction} className="px-8 py-4 bg-blue-800 border border-blue-400/30 text-white hover:bg-blue-700 rounded-2xl font-bold transition-all duration-300">
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

export default Serv;
