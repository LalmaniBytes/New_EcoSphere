import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Activity, Droplets } from 'lucide-react';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, size = [25, 41]) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size[0]}px;
        height: ${size[1]}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">🌍</div>
    `,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]]
  });
};

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    }
  });

  return position === null ? null : (
    <Marker 
      position={position}
      icon={createCustomIcon('#10b981')}
    >
      <Popup>
        <div className="p-2">
          <h4 className="font-semibold text-emerald-700">Selected Location</h4>
          <p className="text-sm text-gray-600">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Environmental data loading...
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const EnvironmentalMarkers = ({ environmentalData }) => {
  if (!environmentalData) return null;

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10b981';  // green
    if (aqi <= 100) return '#f59e0b'; // yellow
    if (aqi <= 150) return '#f97316'; // orange
    if (aqi <= 200) return '#ef4444'; // red
    return '#991b1b'; // dark red
  };

  const { location, aqi_data, weather_data } = environmentalData;

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={createCustomIcon(getAQIColor(aqi_data.aqi), [35, 50])}
    >
      <Popup maxWidth={300}>
        <div className="p-3 min-w-[250px]">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Environmental Data
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Activity className="h-3 w-3" /> AQI:
              </span>
              <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                aqi_data.aqi <= 50 ? 'bg-green-100 text-green-800' :
                aqi_data.aqi <= 100 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {aqi_data.aqi} - {aqi_data.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Temperature:</span>
              <span className="font-semibold">{weather_data.temperature}°C</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Droplets className="h-3 w-3" /> Humidity:
              </span>
              <span className="font-semibold">{weather_data.humidity}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wind:</span>
              <span className="font-semibold">{weather_data.wind_speed} km/h</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Click anywhere on the map to check another location
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ 
  onLocationSelect, 
  selectedLocation, 
  currentLocation, 
  environmentalData 
}) => {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: New Delhi
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
      setMapZoom(13);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.latitude, selectedLocation.longitude]);
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Click handler for location selection */}
        <LocationMarker onLocationSelect={onLocationSelect} />
        
        {/* Current location marker */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={createCustomIcon('#3b82f6')}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-blue-700">Current Location</h4>
                <p className="text-sm text-gray-600">
                  {currentLocation.address || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Environmental data markers */}
        <EnvironmentalMarkers environmentalData={environmentalData} />
      </MapContainer>
      
      {/* Map overlay instructions */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <p className="text-sm font-medium text-gray-700 mb-1">
          📍 Click anywhere to get environmental data
        </p>
        <p className="text-xs text-gray-500">
          Zoom and pan to explore different areas
        </p>
      </div>
    </div>
  );
};

export default MapComponent;