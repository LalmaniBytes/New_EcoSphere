import React, { useState } from "react";
import { MapPin, Thermometer, Wind, Droplets } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import MapComponent from "../components/MapComponent";
import axios from "axios";

const ComparisonPage = ({ currentLocation }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Convert lat/lon → place name using Nominatim
  const getPlaceName = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat,
            lon,
          },
        }
      );
      return response.data.display_name || `Lat: ${lat}, Lon: ${lon}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `Lat: ${lat}, Lon: ${lon}`;
    }
  };

  // 🗺️ When user selects a location on map
  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    try {
      setLoading(true);

      // Get readable address
      const placeName = await getPlaceName(location.latitude, location.longitude);

      // Fetch environmental data (reuses your backend routes)
      const response = await axios.post("/environmental-report", {
        latitude: location.latitude,
        longitude: location.longitude,
        address: placeName,
      });

      const trafficResponse = await axios.post("/traffic", {
        lat: location.latitude,
        lon: location.longitude,
      });

      const combinedData = {
        ...response.data,
        location: {
          ...location,
          address: placeName,
        },
        traffic_data: trafficResponse.data.traffic,
        noise_data: trafficResponse.data.noise,
      };

      setLocations((prev) => [...prev, combinedData]);
      toast.success(`Added ${placeName.split(",")[0]} for comparison!`);
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      toast.error("Failed to fetch data for this location.");
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { status: "Good", color: "bg-green-500", textColor: "text-green-700" };
    if (aqi <= 100) return { status: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-orange-700" };
    if (aqi <= 200) return { status: "Unhealthy", color: "bg-red-500", textColor: "text-red-700" };
    if (aqi <= 300) return { status: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-700" };
    return { status: "Hazardous", color: "bg-red-800", textColor: "text-red-900" };
  };

  return (
    <div className="min-h-screen pt-16 max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Compare Environmental Data 🌍</h1>
        <p className="text-center text-gray-600 mb-4">
          Select multiple locations on the map to compare AQI, weather, and other environmental indicators.
        </p>

        <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
          <MapComponent
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            currentLocation={currentLocation}
            environmentalData={null}
          />
        </div>

        {loading && <p className="text-center text-gray-500">Fetching data...</p>}
      </div>

      {locations.length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {locations.map((loc, index) => {
              const aqiStatus = getAQIStatus(loc.aqi_data.aqi);
              const shortName = loc.location.address.split(",")[0];
              return (
                <Card key={index} className="text-center relative">
                  <Button
                    onClick={() => removeLocation(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                  >
                    ×
                  </Button>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      <MapPin className="inline-block mr-2" />
                      {shortName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">AQI</p>
                      <Badge className={`${aqiStatus.color} text-white px-4 py-1`}>
                        {loc.aqi_data.aqi} ({aqiStatus.status})
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="text-2xl font-bold">{loc.weather_data.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="text-2xl font-bold">{loc.weather_data.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wind Speed</p>
                      <p className="text-2xl font-bold">{loc.weather_data.wind_speed} km/h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Noise Level</p>
                      <p className="text-2xl font-bold">{loc.noise_data?.level || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Water Logging Risk</p>
                      <Badge
                        className={`px-4 py-1 ${
                          loc.water_logging_risk === "low"
                            ? "bg-green-100 text-green-700"
                            : loc.water_logging_risk === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {loc.water_logging_risk?.toUpperCase() || "N/A"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
