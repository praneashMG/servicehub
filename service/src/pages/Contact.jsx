import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  ShieldCheck, ArrowRight, MessageSquare, Mail, MapPin, 
  Clock, Send, Sparkles, CheckCircle2, HelpCircle
} from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  
  // Interactive Component State
  const [inquiryType, setInquiryType] = useState("general");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate API dispatch pipeline
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans relative w-full overflow-hidden antialiased">
      <Navbar />

      {/* Modern Background Blur Mesh */}
      <div className="absolute top-0 right-1/4 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-0 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 pt-24">
        
        {/* HERO HEADER SECTION */}
        <section className="container mx-auto px-6 pt-12 pb-6 max-w-7xl">
          <div className="flex flex-col items-center text-center border-b border-slate-800/60 pb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> 24/7 Dispatch Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Connect With Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Operations Desk</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Have technical implementation questions, escrow inquiries, or corporate partnership ideas? Drop a transmission below and our support array will handle it instantly.
            </p>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT DISPATCH GATEWAY */}
        <section className="container mx-auto px-6 max-w-7xl my-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR: HARD CONNECTIVITY INFRASTRUCTURE ANCHORS */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Direct Routing Channels</h3>
                
                <div className="flex flex-col gap-6">
                  {/* Item 1: Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Secure Link</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">operations@servicehub.com</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Response envelope under 15 mins</p>
                    </div>
                  </div>

                  {/* Item 2: Clock */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Operational Windows</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">Always Online (24/7/365)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Live engineers continuously monitoring escrows</p>
                    </div>
                  </div>

                  {/* Item 3: HQ Location */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Main Tech Node</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">New York City, NY</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Remote operations globally decentralized</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECONDARY TRIPLE RISK ANCHOR PANEL */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Platform Safeguards
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Need rapid infrastructure resolution? Please do not send payment key details via communication streams. Our agents will never request raw security configurations.
                </p>
                <button onClick={() => navigate('/login')} className="w-full py-2.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl text-[11px] font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Access Knowledge Cluster
                </button>
              </div>
            </div>

            {/* RIGHT SIDEBAR: INTERACTIVE COMMUNICATION TERMINAL CONSOLE */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 lg:p-8 backdrop-blur-sm relative">
                
                {/* SUCCESS SUBMISSION MASK DISPLAY */}
                {formSubmitted ? (
                  <div className="py-16 text-center animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Transmission Dispatched</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                      Your operational inquiry has updated successfully onto our dispatch thread. A cluster agent will reply directly to <span className="text-blue-400 font-medium">{formData.email}</span>.
                    </p>
                    <button 
                      onClick={() => { setFormSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Open New Ticket
                    </button>
                  </div>
                ) : (
                  
                  /* REAL-TIME CONTROLLER FORM ARRAY */
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    
                    {/* INQUIRY CATEGORY TOGGLE CHIPS */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-400">Select Dispatch Channel Target</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "general", label: "General Ops" },
                          { id: "billing", label: "Escrow/Billing" },
                          { id: "partnership", label: "Partnership" }
                        ].map((chip) => {
                          const active = inquiryType === chip.id;
                          return (
                            <button
                              key={chip.id}
                              type="button"
                              onClick={() => setInquiryType(chip.id)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                                active 
                                  ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                                  : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* DUAL LAYER FIELDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-400">Your Full Name</label>
                        <input 
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Alex Rivera"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-400">Email Address Anchor</label>
                        <input 
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex@domain.com"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* SUBJECT LINE */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-400">Subject Blueprint</label>
                      <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief summary of requirements..."
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>

                    {/* MESSAGE AREA CONTAINER */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-400">Message Description Scope</label>
                      <textarea 
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Detail the complete parameters of your project, questions, or issues..."
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* SUBMIT BUTTON CONTROL */}
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Secure Message
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM NETWORK METRIC ANCHORS */}
        <section className="container mx-auto px-6 max-w-7xl my-24">
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-sm">
            <div>
              <h4 className="text-3xl font-black text-white mb-1">&lt; 14m</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Median Response Delta</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">99.8%</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Resolution Efficiency</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">100%</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Escrow Accountability</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white mb-1">Active</h4>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Global Nodes Online</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Contact;