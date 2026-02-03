import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";
import JoinHands from "./pages/joinhands";
import ChatWidget from "./pages/chatwidget";
import SignupPage from "./pages/SignUpPage";import About from './pages/About';
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
console.log("Backend URL:", BACKEND_URL);

// Set axios defaults
axios.defaults.baseURL = API;

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("prompt");

  useEffect(() => {
    // Request location permission on app load
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
          maximumAge: 300000, // 5 minutes
        },
      );
    }
  }, []);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50">
        <Navigation />

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
            path="/chat"
            element={<ChatPage currentLocation={currentLocation} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/noise" element={<NoiseWidget />} />
          <Route path="/joinhands" element={<JoinHands />} />
          <Route path="/mentalhealth" element={<MentalHealthAudio />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/About" element={<About />} />
          {/* ADMIN PANEL ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="projects" element={<ActiveProject />} />
            <Route path="Reports" element={<ReportAndDocumentPage />} />
          </Route>
        </Routes>

        <ChatWidget currentLocation={currentLocation} />


        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
