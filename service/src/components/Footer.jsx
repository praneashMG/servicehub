import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0">
              <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
                  Service<span className="text-blue-400">Hub</span>
                </span>
              </div>
            </div>

            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
  ServiceHub delivers premium on-demand home services through a
  seamless digital platform, offering trusted professionals,
  transparent pricing, secure bookings, and exceptional customer
  experiences for modern households and businesses.
</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">

              <li>
                <a href="#" className="hover:text-blue-400">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400">
                  Services
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400">
                  About
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400">
                  Contact
                </a>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-lg font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-slate-400">

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400" />
                <span>support@servicehub.com</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400" />
                <span>Bangalore, India</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          © 2026 ServiceHub. All rights reserved.
        </div>

      </div>

    </footer>
  );
}