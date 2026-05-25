import { Search, Filter } from "lucide-react";

const SearchBar = ({ onSearch, onCategoryChange, selectedCategory }) => {
  const categories = ["All", "AC Repair", "Cleaning", "Plumbing", "Electrician", "Painting", "Beauty", "Car Wash"];

  return (
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for a service..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.1)]"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              onChange={(e) => onCategoryChange(e.target.value)}
              value={selectedCategory}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl pl-10 pr-8 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
            >
              {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>
          
          <div className="relative">
            <select
              onChange={(e) => onPriceChange && onPriceChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
            >
              <option value="" className="bg-slate-900">Any Price</option>
              <option value="50" className="bg-slate-900">Under $50</option>
              <option value="100" className="bg-slate-900">Under $100</option>
              <option value="200" className="bg-slate-900">Under $200</option>
            </select>
          </div>
          
          <div className="relative">
            <select
              onChange={(e) => onRatingChange && onRatingChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
            >
              <option value="" className="bg-slate-900">Any Rating</option>
              <option value="4" className="bg-slate-900">4+ Stars</option>
              <option value="4.5" className="bg-slate-900">4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>
  );
};

export default SearchBar;
