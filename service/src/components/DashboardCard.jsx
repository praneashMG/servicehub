const DashboardCard = ({ title, value, subtitle, trend, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 blur-2xl rounded-full ${colorClass.bg}`}></div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass.bgLight} ${colorClass.text} bg-opacity-20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
