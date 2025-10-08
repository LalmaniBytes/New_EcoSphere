import React, { useState } from "react";
import {
    MapPin,
    Thermometer,
    Wind,
    Droplets,
    Trash2, // More descriptive icon
    Volume2, // Icon for Noise
    Waves, // Icon for Water Logging
    MousePointerClick, // Icon for empty state
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import MapComponent from "../components/MapComponent";
import axios from "axios";

// A small, reusable component for displaying individual stats within the card
const StatItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
        {icon}
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-base">{value}</p>
        </div>
    </div>
);

const ComparisonPage = ({ currentLocation }) => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔁 Convert lat/lon → place name using Nominatim (No changes here)
    const getPlaceName = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse`,
                {
                    params: { format: "json", lat, lon },
                }
            );
            return response.data.display_name || `Lat: ${lat}, Lon: ${lon}`;
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return `Lat: ${lat}, Lon: ${lon}`;
        }
    };

    // 🗺️ When user selects a location on map (No changes to logic)
    const handleLocationSelect = async (location) => {
        // Prevent adding duplicates
        if (
            locations.some(
                (loc) =>
                    loc.location.latitude === location.latitude &&
                    loc.location.longitude === location.longitude
            )
        ) {
            toast.info("This location has already been added.");
            return;
        }

        setSelectedLocation(location);
        try {
            setLoading(true);
            const placeName = await getPlaceName(
                location.latitude,
                location.longitude
            );
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

    // 🎨 Status function remains the same, but we'll use its output differently
    const getAQIStatus = (aqi) => {
        if (aqi <= 50) return { status: "Good", color: "bg-green-500", textColor: "text-green-600" };
        if (aqi <= 100) return { status: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
        if (aqi <= 150) return { status: "Unhealthy for Sensitive", color: "bg-orange-500", textColor: "text-orange-600" };
        if (aqi <= 200) return { status: "Unhealthy", color: "bg-red-500", textColor: "text-red-600" };
        if (aqi <= 300) return { status: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-600" };
        return { status: "Hazardous", color: "bg-maroon-800", textColor: "text-maroon-900" };
    };

    return (
        <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 space-y-8 m-10">
            {/* SECTION: Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Compare Environmental Data 🌍
                </h1>
                <p className="text-lg text-muted-foreground">
                    Click on the map to add locations and compare their environmental stats side-by-side.
                </p>
            </div>

            {/* SECTION: Map */}
            <div className="h-[50vh] w-full rounded-xl overflow-hidden shadow-lg border">
                <MapComponent
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                    currentLocation={currentLocation}
                    environmentalData={null}
                />
            </div>

            {loading && <p className="text-center text-muted-foreground animate-pulse">Fetching data for selected location...</p>}

            <hr className="my-8" />

            {/* SECTION: Comparison Cards */}
            {locations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {locations.map((loc, index) => {
                        const aqiStatus = getAQIStatus(loc.aqi_data.aqi);
                        const shortName = loc.location.address.split(",")[0];
                        return (
                            <Card
                                key={index}
                                className="relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <Button
                                    onClick={() => removeLocation(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 z-10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-xl truncate pr-8">
                                        <MapPin className="h-5 w-5 mr-2 shrink-0" />
                                        {shortName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* AQI Section - Made more prominent */}
                                    <div className={`text-center p-4 rounded-lg ${aqiStatus.color.replace('bg-', 'bg-')}/10`}>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Air Quality Index (AQI)
                                        </p>
                                        <p className={`text-5xl font-bold ${aqiStatus.textColor}`}>
                                            {loc.aqi_data.aqi}
                                        </p>
                                        <p className={`font-semibold text-sm ${aqiStatus.textColor}`}>
                                            {aqiStatus.status}
                                        </p>
                                    </div>

                                    {/* Other Stats Grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left">
                                        <StatItem
                                            icon={<Thermometer className="h-5 w-5 text-red-500" />}
                                            label="Temperature"
                                            value={`${loc.weather_data.temperature}°C`}
                                        />
                                        <StatItem
                                            icon={<Droplets className="h-5 w-5 text-blue-500" />}
                                            label="Humidity"
                                            value={`${loc.weather_data.humidity}%`}
                                        />
                                        <StatItem
                                            icon={<Wind className="h-5 w-5 text-gray-500" />}
                                            label="Wind Speed"
                                            value={`${loc.weather_data.wind_speed} km/h`}
                                        />
                                        <StatItem
                                            icon={<Volume2 className="h-5 w-5 text-indigo-500" />}
                                            label="Noise Level"
                                            value={loc.noise_data?.level || "N/A"}
                                        />
                                    </div>

                                    {/* Water Logging Risk */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Waves className="h-5 w-5 text-cyan-600" />
                                            <p className="text-sm font-medium">Water Logging Risk</p>
                                        </div>
                                        <Badge
                                            className={`capitalize ${loc.water_logging_risk === "low"
                                                ? "bg-green-100 text-green-800 border border-green-200"
                                                : loc.water_logging_risk === "medium"
                                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                    : "bg-red-100 text-red-800 border border-red-200"
                                                }`}
                                        >
                                            {loc.water_logging_risk || "N/A"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                // ✨ ENHANCEMENT: Added an empty state placeholder
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-slate-50">
                    <MousePointerClick className="h-12 w-12 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">No Locations to Compare</h2>
                    <p className="text-muted-foreground">Click on the map above to add your first location.</p>
                </div>
            )}
        </div>
    );
};

export default ComparisonPage;