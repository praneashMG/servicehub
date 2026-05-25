import { MapPin, Phone, Calendar, Clock, DollarSign } from "lucide-react";

const BookingCard = ({ booking, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': 
      case 'Payment Pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Confirmed': 
      case 'Assigned': 
      case 'Payment Submitted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Completed': 
      case 'Paid':
      case 'Payment Verified': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getProgressLevel = (status) => {
    const s = status || '';
    if (s === 'Pending') return 0;
    if (s === 'Confirmed') return 1;
    if (s === 'Assigned' || s === 'User Accepted' || s === 'Payment Pending' || s === 'Payment Submitted') return 2;
    if (s === 'Completed' || s === 'Paid' || s === 'Payment Verified') return 3;
    return -1; // Cancelled or unknown
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-white/20 transition-all duration-300 group flex flex-col md:flex-row">
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative">
        <img 
          src={booking.service_image} 
          alt={booking.service_title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 to-transparent md:w-full opacity-80 md:opacity-60"></div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(booking.status)} backdrop-blur-md`}>
          {booking.status}
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-1 group-hover:text-cyan-400 transition-colors">
              {booking.service_title}
            </h3>
            <p className="text-slate-400 text-xs">Booking ID: #{booking.id.toString().padStart(6, '0')}</p>
          </div>
          <p className="text-xl font-bold text-emerald-400 flex items-center">
            <DollarSign className="w-5 h-5 -mr-1" />
            {booking.service_price}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6">
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Calendar className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>{formatDate(booking.booking_date)}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate">{booking.address}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Phone className="w-4 h-4 text-green-400 shrink-0" />
            <span>{booking.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Timeline Tracker */}
        {booking.status !== 'Cancelled' && (
          <div className="mb-6 flex-1 flex flex-col justify-end">
            <div className="relative flex items-center justify-between mt-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full"></div>
              
              {/* Progress Line */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-500 rounded-full transition-all duration-1000"
                style={{
                  width: getProgressLevel(booking.status) === 0 ? '0%' : 
                         getProgressLevel(booking.status) === 1 ? '33.3%' : 
                         getProgressLevel(booking.status) === 2 ? '66.6%' : 
                         getProgressLevel(booking.status) === 3 ? '100%' : '0%'
                }}
              ></div>

              {['Pending', 'Confirmed', 'Assigned', 'Completed'].map((step, idx) => {
                const isActive = getProgressLevel(booking.status) >= idx;
                  
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2 group">
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-4 ${isActive ? 'bg-cyan-400 border-slate-900 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-slate-800 border-slate-700'} transition-all duration-500`}></div>
                    <span className={`absolute top-6 text-[10px] md:text-xs font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-6"></div> {/* Spacer for absolute text */}
          </div>
        )}
        
        <div className="flex items-center justify-end border-t border-white/5 pt-4 mt-auto">
          {booking.status === 'Pending' && (
            <button 
              onClick={() => onCancel(booking.id)}
              className="px-5 py-2 rounded-xl text-red-400 hover:text-white border border-red-500/30 hover:bg-red-500 transition-colors text-sm font-medium"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
