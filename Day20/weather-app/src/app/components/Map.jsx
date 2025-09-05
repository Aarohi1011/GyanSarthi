"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";

// Dynamically import Leaflet components (to avoid SSR issues)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Custom marker icon (weather pin style)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png", // ☀️ example icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export default function Map({ location, weatherData, unit }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !location) {
    return (
      <div className="h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading map...</p>
      </div>
    );
  }

  // ✅ Handle Open-Meteo structure
  let currentTemp = null;
  let description = null;

  if (weatherData?.hourly) {
    currentTemp = Math.round(weatherData.hourly.temperature_2m[0]);
    description = `Wind ${Math.round(
      weatherData.hourly.wind_speed_10m[0]
    )} ${unit === "metric" ? "m/s" : "mph"}`;
  }

  return (
    <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            <div className="text-center text-gray-800">
              <strong className="block text-lg">{location.name || "Location"}</strong>
              {currentTemp !== null ? (
                <>
                  <span className="block text-xl font-semibold mt-1">
                    {currentTemp}°{unit === "metric" ? "C" : "F"}
                  </span>
                  <span className="block text-sm text-gray-600 mt-1">
                    {description}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">No weather data available</span>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
