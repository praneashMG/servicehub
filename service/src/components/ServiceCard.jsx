import { Heart } from "lucide-react";

const ServiceCard = ({ service, isFavorite, onToggleFavorite }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-cyan-500/30 transition-all duration-300 group flex flex-col h-full relative">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"} 
          alt={service.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          <span className="text-xs font-medium text-cyan-400">{service.category}</span>
        </div>
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors z-10"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-slate-200">
            ${service.price}
          </p>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] active:scale-95">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
