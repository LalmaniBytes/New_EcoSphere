import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import ChatPage from './pages/ChatPage';
import JoinHands from './pages/joinhands';
import ChatWidget from './pages/chatwidget';

import Navigation from './components/Navigation';
import { Toaster } from './components/ui/sonner';
import '@/App.css';
import NoiseWidget from './hooks/NoiseWidget';
import MentalHealthAudio from './pages/MentalHealthAudio';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
console.log("Backend URL:", BACKEND_URL); 

// Set axios defaults
axios.defaults.baseURL = API;

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');

  useEffect(() => {
    // Request location permission on app load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
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
            element={
              <ChatPage 
                currentLocation={currentLocation}
              />
            } 
          />
          <Route 
            path="/noise" 
            element={
              <NoiseWidget />} 
          />
          <Route 
            path="/joinhands" 
            element={
              <JoinHands/>} 
          />
          <Route 
            path="/mentalhealth" 
            element={
              <MentalHealthAudio/>} 
          />
          
        </Routes>
        {/* Floating Chat Widget */}
        <ChatWidget currentLocation={currentLocation} />

        
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}


export default App;