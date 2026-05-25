import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BookingModal from "../components/BookingModal";
import api from "../services/api";
import { ArrowLeft, Star, Clock, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avg_rating: 0, total_reviews: 0 });
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const [serviceRes, reviewsRes] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/reviews/service/${id}`)
        ]);
        setService(serviceRes.data);
        setReviews(reviewsRes.data.reviews || []);
        setStats(reviewsRes.data.stats || { avg_rating: 0, total_reviews: 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userReview.trim()) return toast.error("Please write a review");
    
    setIsSubmittingReview(true);
    try {
      const res = await api.post("/reviews", {
        service_id: id,
        rating: userRating,
        review: userReview
      });
      setReviews([res.data, ...reviews]);
      setStats({
        ...stats,
        total_reviews: Number(stats.total_reviews) + 1,
        // Approximate new average
        avg_rating: ((Number(stats.avg_rating) * Number(stats.total_reviews)) + userRating) / (Number(stats.total_reviews) + 1)
      });
      setUserReview("");
      setUserRating(5);
      toast.success("Review added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 opacity-80"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
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
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex justify-center items-center h-full">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
             </div>
          ) : !service ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <h2 className="text-2xl font-bold mb-4">Service not found</h2>
              <button onClick={() => navigate('/services')} className="text-cyan-400 hover:underline">Go back to services</button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto p-6 md:p-8">
              <button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Services
              </button>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="h-64 lg:h-auto relative">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-6 left-6 flex gap-3">
                      <span className="px-4 py-1.5 bg-blue-600/80 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                        {service.category}
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full text-yellow-400 text-sm font-medium border border-white/20">
                        <Star className="w-4 h-4 fill-current" />
                        {Number(stats.avg_rating).toFixed(1)} ({stats.total_reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        {service.title}
                      </h1>
                      <div className="flex items-end gap-3 mb-8">
                        <span className="text-4xl font-bold text-cyan-400">${service.price}</span>
                        <span className="text-slate-400 mb-1">/ service</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Description
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-8">
                        {service.description}
                        {" "}Our professional providers ensure top-quality service with a 100% satisfaction guarantee. We arrive on time, fully equipped, and ready to complete the job to the highest standards.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                          <Clock className="w-8 h-8 text-emerald-400" />
                          <div>
                            <p className="text-white font-medium">Availability</p>
                            <p className="text-slate-400 text-xs mt-0.5">Usually within 24h</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                          <ShieldCheck className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Verified</p>
                            <p className="text-slate-400 text-xs mt-0.5">Background checked</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-10">
                        <h3 className="text-white font-semibold mb-2">What's Included:</h3>
                        {['Professional equipment provided', 'Fully insured service', 'Post-service cleanup', 'Satisfaction guarantee'].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_40px_rgba(6,182,212,0.5)] transition-all active:scale-[0.98] transform group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Book Service Now
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                      <h3 className="text-5xl font-extrabold text-white mb-2">{Number(stats.avg_rating).toFixed(1)}</h3>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-5 h-5 ${star <= Math.round(stats.avg_rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <p className="text-slate-400 text-sm">Based on {stats.total_reviews} reviews</p>
                    </div>

                    <form onSubmit={handleSubmitReview} className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-white font-semibold mb-4">Write a Review</h4>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= userRating ? 'text-yellow-400 fill-current' : 'text-slate-600'} hover:text-yellow-300 transition-colors`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm mb-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none h-24 resize-none"
                      />
                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {reviews.length === 0 ? (
                      <p className="text-slate-400 text-center py-10">No reviews yet. Be the first to review!</p>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={review.user_image || "https://ui-avatars.com/api/?name=" + review.user_name} 
                                alt={review.user_name} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h5 className="text-white font-medium text-sm">{review.user_name}</h5>
                                <p className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{review.review}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && service && (
        <BookingModal service={service} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ServiceDetails;
