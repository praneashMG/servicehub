import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Services = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = "/services?";
        if (selectedCategory !== "All") url += `category=${selectedCategory}&`;
        if (searchQuery) url += `search=${searchQuery}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;
        if (minRating) url += `minRating=${minRating}&`;
        
        const [servicesRes, favsRes] = await Promise.all([
          api.get(url),
          api.get("/favorites").catch(() => ({ data: [] })) // Handle if not logged in
        ]);
        
        setServices(servicesRes.data);
        setFavorites(favsRes.data.map(f => f.id));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, maxPrice, minRating]);

  const toggleFavorite = async (e, serviceId) => {
    e.preventDefault(); // prevent Link navigation
    try {
      if (favorites.includes(serviceId)) {
        await api.delete(`/favorites/${serviceId}`);
        setFavorites(favorites.filter(id => id !== serviceId));
      } else {
        await api.post("/favorites", { service_id: serviceId });
        setFavorites([...favorites, serviceId]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 opacity-80"></div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>
      <div className="relative z-10 hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Explore Services</h1>
            <p className="text-slate-400">Find and book the perfect service provider for your needs.</p>
          </div>

          <SearchBar 
            onSearch={setSearchQuery} 
            onCategoryChange={setSelectedCategory} 
            selectedCategory={selectedCategory} 
            onPriceChange={setMaxPrice}
            onRatingChange={setMinRating}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col p-4">
                  <Skeleton height={192} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
                  <div className="mt-4 mb-2">
                    <Skeleton width="80%" height={24} baseColor="#1e293b" highlightColor="#334155" />
                  </div>
                  <Skeleton count={2} baseColor="#1e293b" highlightColor="#334155" />
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <Skeleton width={60} height={28} baseColor="#1e293b" highlightColor="#334155" />
                    <Skeleton width={100} height={36} baseColor="#1e293b" highlightColor="#334155" borderRadius="0.75rem" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-red-400">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-lg">No services found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setMaxPrice(""); setMinRating(""); }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <Link to={`/services/${service.id}`} key={service.id}>
                  <ServiceCard 
                    service={service} 
                    isFavorite={favorites.includes(service.id)} 
                    onToggleFavorite={(e) => toggleFavorite(e, service.id)} 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Services;
