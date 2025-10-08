import React, { useState, useEffect } from "react";
import {
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Activity,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import MapComponent from "../components/MapComponent";
import EnvironmentalReport from "../components/EnvironmentalReport";
import axios from "axios";
import { add } from "date-fns";

const HomePage = ({
  currentLocation,
  setCurrentLocation,
  locationPermission,
}) => {
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Run only if a location exists AND the initial load has NOT been completed.
    if (currentLocation && !initialLoadComplete) {
      handleLocationSelect(currentLocation);
      setInitialLoadComplete(true);
    }
  }, [currentLocation, initialLoadComplete]);

  // Fetch environmental data for a location
  const fetchEnvironmentalData = async (location) => {
    setLoading(true);
    try {
      const response = await axios.post("/environmental-report", {
        latitude: location.latitude,
        longitude: location.longitude,
        address:
          location.address ||
          `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      });
      const trafficResponse = await axios.post("/traffic", {
        lat: location.latitude,
        lon: location.longitude,
      });
      const combinedData = {
        ...response.data,
        location: location,
        traffic_data: trafficResponse.data.traffic,
        noise_data: trafficResponse.data.noise,
      };
      setEnvironmentalData(combinedData);
      // setEnvironmentalData(response.data);
      setShowReport(true);
      toast.success("Environmental data loaded successfully!");
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      toast.error("Failed to load environmental data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    try {
      // 1. Get the real address from the coordinates first
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
      const { data } = await axios.get(geoUrl);
      const address =
        data.display_name ||
        `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

      // 2. Create the final, updated location object
      const updatedLocation = {
        ...location,
        address: address,
      };

      // 3. Update state with the final object
      setSelectedLocation(updatedLocation);
      setCurrentLocation(updatedLocation);
      console.log("Selected Location:", updatedLocation);
      console.log("Current Location:", updatedLocation);
      // 4. NOW, call the data fetching function ONCE with the correct data
      fetchEnvironmentalData(updatedLocation);
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      toast.error("Failed to fetch location name.");
      // Fallback: Use the original location if geocoding fails
      setSelectedLocation(location);
      setCurrentLocation(location);
      fetchEnvironmentalData(location);
    }
  };

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location",
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast.error(
            "Unable to get current location. Please select a location on the map."
          );
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Auto-load data for current location on component mount
  useEffect(() => {
    if (currentLocation && !environmentalData) {
      fetchEnvironmentalData(currentLocation);
    }
  }, [currentLocation]);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50)
      return {
        status: "Good",
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    if (aqi <= 100)
      return {
        status: "Moderate",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
      };
    if (aqi <= 150)
      return {
        status: "Unhealthy for Sensitive Groups",
        color: "bg-orange-500",
        textColor: "text-orange-700",
      };
    if (aqi <= 200)
      return {
        status: "Unhealthy",
        color: "bg-red-500",
        textColor: "text-red-700",
      };
    if (aqi <= 300)
      return {
        status: "Very Unhealthy",
        color: "bg-purple-500",
        textColor: "text-purple-700",
      };
    return {
      status: "Hazardous",
      color: "bg-red-800",
      textColor: "text-red-900",
    };
  };
  console.log("Environmental Data:", environmentalData);
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="gradient-text">Eco</span>Sphere &#x1F30D;
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto animate-slide-up">
              Your comprehensive environmental monitoring platform. Get
              real-time air quality, weather data, and AI-powered insights for
              any location.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button
                onClick={useCurrentLocation}
                disabled={loading}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold rounded-full btn-hover"
                data-testid="use-current-location-btn"
              >
                {loading ? (
                  <div className="spinner mr-2" />
                ) : (
                  <MapPin className="mr-2 h-5 w-5" />
                )}
                {loading ? "Loading..." : "Use Current Location"}
              </Button>

              <p className="text-emerald-200 text-sm">
                or click on the map below to select any location
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Earth Image */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-6xl">🌍</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Location Selector
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Click anywhere on the map to get environmental data for that
                  location
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapComponent
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                    currentLocation={currentLocation}
                    environmentalData={environmentalData}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {environmentalData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center card-hover">
                  <CardContent className="p-4">
                    <Activity className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {environmentalData.aqi_data.aqi}
                    </p>
                    <p className="text-sm text-gray-600">AQI</p>
                  </CardContent>
                </Card>

                <Card className="text-center card-hover">
                  <CardContent className="p-4">
                    <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {environmentalData.weather_data.temperature}°
                    </p>
                    <p className="text-sm text-gray-600">Temp</p>
                  </CardContent>
                </Card>

                <Card className="text-center card-hover">
                  <CardContent className="p-4">
                    <Wind className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {environmentalData.weather_data.wind_speed}
                    </p>
                    <p className="text-sm text-gray-600">Wind km/h</p>
                  </CardContent>
                </Card>

                <Card className="text-center card-hover">
                  <CardContent className="p-4">
                    <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {environmentalData.weather_data.humidity}%
                    </p>
                    <p className="text-sm text-gray-600">Humidity</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Environmental Report Section */}
          <div className="space-y-6">
            {showReport && environmentalData ? (
              <EnvironmentalReport
                data={environmentalData}
                onRefresh={() =>
                  fetchEnvironmentalData(selectedLocation || currentLocation)
                }
                loading={loading}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Environmental Report Card
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a location to view comprehensive environmental data,
                    air quality metrics, weather conditions, and AI-powered
                    recommendations.
                  </p>
                  {locationPermission === "denied" && (
                    <Alert className="max-w-md mx-auto">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Location access denied. Please click on the map to
                        select a location manually.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
