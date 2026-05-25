import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Serv from "./pages/Serv";
import Providers from "./pages/Providers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderConfirm from "./pages/ProviderConfirm";
import UserAcceptance from "./pages/UserAcceptance";
import PayNow from "./pages/PayNow";
import ProviderPaymentVerify from "./pages/ProviderPaymentVerify";
import ProviderComplete from "./pages/ProviderComplete";
import TrackLocation from "./pages/TrackLocation";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/serv" element={<Serv />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/services/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment/now/:bookingId" element={<ProtectedRoute><PayNow /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/provider/dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
          <Route path="/provider/confirm/:bookingId" element={<ProviderConfirm />} />
          <Route path="/provider/complete/:bookingId" element={<ProviderComplete />} />
          <Route path="/provider/payment/:bookingId" element={<ProviderPaymentVerify />} />
          <Route path="/booking/accept/:bookingId" element={<UserAcceptance />} />
          <Route path="/booking/decline/:bookingId" element={<UserAcceptance />} />
          <Route path="/booking/track/:bookingId" element={<ProtectedRoute><TrackLocation /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;