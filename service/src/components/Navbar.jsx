import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Sparkles, LayoutDashboard, Briefcase, Users, Info, Mail, Calendar, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Services', path: '/serv', icon: Briefcase },
    { name: 'Providers', path: '/providers', icon: Users },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0a0e27]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-b border-white/10'
            : 'bg-[#0a0e27]/80 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section - Responsive sizing */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0"
            >
              <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  Service<span className="text-blue-400">Hub</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on tablet and below */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'text-white bg-white/10 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{link.name}</span>
                    <span className="xl:hidden">{link.name}</span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </NavLink>
              ))}
              {user && (
                <NavLink
                  to={user.role === 'admin' ? "/admin" : "/dashboard"}
                  className={({ isActive }) =>
                    `relative px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'text-white bg-white/10 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden xl:inline">Dashboard</span>
                    <span className="xl:hidden">Dashboard</span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </NavLink>
              )}
            </div>

            {/* Desktop Right Section - Responsive */}
            <div className="hidden lg:flex items-center gap-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="group relative px-5 py-2 text-sm font-medium text-white overflow-hidden rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </span>
                  </Link>
                  <Link
                    to="/register"
                    className="group relative px-6 py-2 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span className="relative z-10">Register</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-[#0a0e27] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                        {user.profile_image ? (
                          <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          (user.name || user.username || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white">{user.name || user.username || 'User'}</span>
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Menu Button - Visible on lg screens and below */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Sidebar Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-br from-[#0a0e27] to-[#0f1435] shadow-2xl transform transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    Service<span className="text-blue-400">Hub</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>

            {/* Sidebar Navigation - Scrollable */}
            <div className="flex-1 overflow-y-auto py-4 sm:py-8 px-4 sm:px-6">
              <div className="space-y-1 sm:space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg sm:rounded-xl transition-all duration-300 group"
                  >
                    <link.icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base font-medium">{link.name}</span>
                  </Link>
                ))}
                {user && (
                  <Link
                    to={user.role === 'admin' ? "/admin" : "/dashboard"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg sm:rounded-xl transition-all duration-300 group"
                  >
                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base font-medium">Dashboard</span>
                  </Link>
                )}
              </div>

              {/* Sidebar Divider */}
              <div className="my-4 sm:my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Sidebar Buttons */}
              <div className="space-y-2 sm:space-y-3">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 text-white border border-white/20 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] text-sm sm:text-base"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full bg-[#0a0e27] rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                          {user.profile_image ? (
                            <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            (user.name || user.username || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                      </div>
                      <span className="text-base font-medium text-white">{user.name || user.username || 'User'}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); navigate('/login'); }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10">
              <p className="text-xs text-gray-400 text-center">
                © 2024 ServiceHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;