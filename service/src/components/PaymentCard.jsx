import { CheckCircle2, Clock, XCircle } from "lucide-react";

const PaymentCard = ({ payment }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "Pending":
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="bg-white/5 border border-slate-700/50 rounded-2xl p-5 hover:bg-white/10 transition-all backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.payment_status === 'Paid' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            {getStatusIcon(payment.payment_status)}
          </div>
          <div>
            <p className="text-white font-semibold flex items-center gap-2">
              ${parseFloat(payment.amount).toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">Order ID: {payment.transaction_id || 'N/A'}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${payment.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {payment.payment_status}
          </span>
          <p className="text-[10px] text-slate-500 mt-2">{new Date(payment.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-sm text-slate-300 border-t border-slate-700/50 pt-3">
        Booking #{payment.booking_id}
      </div>
    </div>
  );
};

export default PaymentCard;
