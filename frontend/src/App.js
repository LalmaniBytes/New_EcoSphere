import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AlertTriangle } from "lucide-react"; // Added for the button icon
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";
import JoinHands from "./pages/joinhands";
import ReportIssuePage from "./pages/ReportIssue";
import Footer from "./components/footer";
import ChatWidget from "./pages/chatwidget";
import SignupPage from "./pages/SignUpPage";
import About from './pages/About';
import AdminLogin from "./pages/AdminLogin";
import Navigation from "./components/Navigation";
import { Toaster } from "./components/ui/sonner";
import "@/App.css";
import NoiseWidget from "./hooks/NoiseWidget";
import MentalHealthAudio from "./pages/MentalHealthAudio";
import ComparisonPage from "./pages/ComparisonPage";
import UserDashboard from "./pages/userDashboard";
import AdminLayout from './layout/Admin_Layout';
import Admin from './pages/Admin/Admin';
import CaseManagement from './pages/Admin/CaseManagement';
import ActiveProject from './pages/Admin/ActiveProject';
import ReportAndDocumentPage from './pages/Admin/ReportAndDocumentpage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Set axios defaults
axios.defaults.baseURL = API;

// Internal wrapper to access Router hooks (navigate, location)
function AppContent({ currentLocation, setCurrentLocation, locationPermission }) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // Scroll to top on every route/parameter change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="App min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                currentLocation={currentLocation}
                setCurrentLocation={setCurrentLocation}
                locationPermission={locationPermission}
              />
            }
          />
          <Route
            path="/report"
            element={
              <ReportPage
                currentLocation={currentLocation}
                setCurrentLocation={setCurrentLocation}
              />
            }
          />
          <Route
            path="/report-issue"
            element={
              <ReportIssuePage
                currentLocation={currentLocation}
                setCurrentLocation={setCurrentLocation}
              />
            }
          />
          <Route
            path="/chat"
            element={<ChatPage currentLocation={currentLocation} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/noise" element={<NoiseWidget />} />
          <Route path="/joinhands" element={<JoinHands />} />
          <Route path="/mentalhealth" element={<MentalHealthAudio />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/About" element={<About />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* ADMIN PANEL ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="projects" element={<ActiveProject />} />
            <Route path="Reports" element={<ReportAndDocumentPage />} />
          </Route>
        </Routes>
      </main>

      {/* FLOATING QUICK REPORT BUTTON */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => {
            navigate("/report", { state: { initialLocation: currentLocation } });
          }}
          className="group relative flex items-center justify-center w-16 h-16 transition-all hover:scale-110 active:scale-95 drop-shadow-lg"
        >
          {/* Solid White Circle Background */}
          <div className="absolute inset-0 bg-white rounded-full border border-slate-100 shadow-sm transition-colors group-hover:bg-slate-50"></div>

          {/* Subtle Pulse Effect */}
          <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-25"></div>

          {/* The Alert Icon */}
          <AlertTriangle
            className="relative z-10 text-yellow-600 h-8 w-8 stroke-[2.5px]"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </button>
      </div>

      <Footer />
      <ChatWidget currentLocation={currentLocation} />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("prompt");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission("granted");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission("denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    }
  }, []);

  return (
    <Router>
      <AppContent 
        currentLocation={currentLocation} 
        setCurrentLocation={setCurrentLocation} 
        locationPermission={locationPermission} 
      />
    </Router>
  );
}

export default App;