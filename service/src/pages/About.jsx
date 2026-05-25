import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  ShieldCheck, ArrowRight, Heart, Users, Target, 
  Sparkles, Globe, Award, ChevronRight, CheckCircle2
} from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "CEO & Co-Founder",
    avatar: "https://i.pravatar.cc/150?u=elena",
    bio: "Ex-Product lead at Stripe. Passionate about empowering independent service professionals with equitable financial tooling.",
    focus: "Strategic Vision"
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    bio: "Systems architect specialize in decentralized escrow pipelines and realtime automated matching protocols.",
    focus: "Core Engineering"
  },
  {
    id: 3,
    name: "Aisha Rahman",
    role: "Head of Trust & Safety",
    avatar: "https://i.pravatar.cc/150?u=aisha",
    bio: "Dedicated to designing the industry's most rigorous multi-tiered vetting pipelines and platform verification guardrails.",
    focus: "Risk & Vetting"
  }
];

const companyMilestones = [
  {
    id: "origin",
    year: "2023",
    title: "The Genesis Spark",
    description: "ServiceHub was founded in a tiny apartment with a simple premise: home services shouldn't rely on guesswork or blind trust. We launched our initial protocol with 20 vetted contractors."
  },
  {
    id: "growth",
    year: "2025",
    title: "Vetting Transformation",
    description: "Introduced our signature 4-stage background check system and milestone-locked payment protections. Active monthly transactions surged by over 400% across metro hubs."
  },
  {
    id: "future",
    year: "2026",
    title: "Global Scale & Remote Sectors",
    description: "Expanded past offline physical operations into technical and digital service frameworks, connecting remote engineering specialists and creators with secure milestone escrow pipelines globally."
  }
];

const About = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("origin");

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans relative w-full overflow-hidden antialiased">
      <Navbar />

      {/* Modern Background Blur Mesh */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-0 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 pt-24">
        
        {/* HERO TITLE SECTION */}
        <section className="container mx-auto px-6 pt-12 pb-6 max-w-7xl">
          <div className="flex flex-col items-center text-center border-b border-slate-800/60 pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Empowering Autonomous Work
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 max-w-3xl">
              We Are Architecting The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Trust Layer</span> of Services
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed">
              ServiceHub bridges elite talent with clients through automated vetting mechanics, absolute escrow isolation, and true work verification loops.
            </p>
          </div>
        </section>

        {/* CORE CORE VALUES SECTION */}
        <section className="container mx-auto px-6 max-w-7xl my-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Radical Transparency", 
                desc: "No hidden subscription taxes, no manipulated metrics. Review trails and billing instances are verified cryptographically via completed contracts.", 
                icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
              },
              { 
                title: "Guaranteed Escrow Protection", 
                desc: "We stand entirely in defense of talent and capital. Milestone budgets are fully isolated dynamically, eliminating non-payment risks.", 
                icon: <Target className="w-5 h-5 text-indigo-400" />
              },
              { 
                title: "Rigorous Capability Checks", 
                desc: "We prioritize density over volume. Our active providers undergo continuous background loops and mandatory identity validation checks.", 
                icon: <Award className="w-5 h-5 text-emerald-400" />
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl flex flex-col items-start hover:border-slate-700 transition-colors">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{value.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE MILESTONE TIMELINE TABS */}
        <section className="container mx-auto px-6 max-w-4xl my-24">
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 text-center">Our Evolution History</h3>
            
            {/* Tab Selectors */}
            <div className="flex border-b border-slate-800 gap-2 mb-6">
              {companyMilestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === m.id 
                      ? "border-blue-500 text-white" 
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {m.year} — {m.id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tab Display Area */}
            {companyMilestones.map((m) => {
              if (m.id !== activeTab) return null;
              return (
                <div key={m.id} className="animate-fade-in py-2">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> {m.title}
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{m.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* EXECUTIVE TEAM SECTION */}
        <section className="container mx-auto px-6 max-w-7xl my-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">The Minds Behind ServiceHub</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">An interdisciplinary ensemble committed to transforming the economics of decentralized expertise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 hover:bg-slate-900/50 transition-all duration-200 flex flex-col group">
                <div className="flex items-center gap-4 mb-4">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border border-slate-800 object-cover group-hover:border-blue-500/50 transition-colors" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-[11px] text-blue-400 font-medium">{member.role}</p>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
                  "{member.bio}"
                </p>

                <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center mt-auto">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Functional Area</span>
                  <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded-md font-medium">
                    {member.focus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* METRICS SUMMARY GRID CONTAINER */}
        <section className="container mx-auto px-6 max-w-7xl my-24">
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-sm">
            <div>
              <h4 className="text-3xl font-black text-white mb-1">26+</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Urban Hubs Cleared</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">$4.2M</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Escrow Flow Handled</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">12K+</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Validated Peer Evaluations</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">&lt; 3min</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Average Support Dispatch</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION CONSOLE */}
        <section className="container mx-auto px-6 max-w-7xl mb-20">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-white mb-3">Partner with our vision</h2>
              <p className="text-sm text-slate-400 mb-8">Whether you are sourcing multi-disciplinary talent grids or expanding your operations as an independent provider, our system is custom engineered for your security.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-bold transition-transform duration-200">
                  Browse Active Experts
                </button>
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-transform duration-200">
                  Read Platform Whitepaper
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

export default About;