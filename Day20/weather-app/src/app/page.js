"use client";

import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard";
import Map from "./components/Map";
import SearchBar from "./components/SearchBar";
import Forecast from "./components/Forecast";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
    name: "New York",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const name = await reverseGeocode(latitude, longitude);
          setLocation({ lat: latitude, lng: longitude, name });
          fetchWeatherData(latitude, longitude);
          fetchForecastData(latitude, longitude);
        },
        () => {
          fetchWeatherData(location.lat, location.lng);
          fetchForecastData(location.lat, location.lng);
        }
      );
    } else {
      fetchWeatherData(location.lat, location.lng);
      fetchForecastData(location.lat, location.lng);
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Unknown Location"
      );
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return "Unknown Location";
    }
  };

  const fetchWeatherData = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/weather?lat=${lat}&lon=${lng}&units=${unit}`
      );
      const data = await response.json();
      if (!data || !data.hourly) throw new Error("Invalid weather data received");
      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (lat, lng) => {
    try {
      const response = await fetch(
        `/api/forecast?lat=${lat}&lon=${lng}&units=${unit}`
      );
      const data = await response.json();
      if (!data || !data.list)
        throw new Error("Invalid forecast data received");
      setForecastData(data);
    } catch (err) {
      console.error("Forecast fetch error:", err);
    }
  };

  const handleSearch = async (searchLocation) => {
    if (searchLocation.lat && searchLocation.lng) {
      let cityName = searchLocation.name;
      if (!cityName)
        cityName = await reverseGeocode(searchLocation.lat, searchLocation.lng);

      const newLocation = {
        lat: searchLocation.lat,
        lng: searchLocation.lng,
        name: cityName,
      };
      setLocation(newLocation);
      setWeatherData(null);
      setForecastData(null);
      setError(null);
      setLoading(true);

      fetchWeatherData(searchLocation.lat, searchLocation.lng);
      fetchForecastData(searchLocation.lat, searchLocation.lng);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (location) {
      fetchWeatherData(location.lat, location.lng);
      fetchForecastData(location.lat, location.lng);
    }
  };

  const getBackground = () => {
    if (!weatherData?.current?.weather)
      return "from-blue-500 via-indigo-500 to-purple-600";
    const main = weatherData.current.weather[0].main.toLowerCase();

    if (main.includes("rain"))
      return "from-blue-700 via-gray-700 to-black";
    if (main.includes("cloud"))
      return "from-gray-400 via-blue-500 to-indigo-600";
    if (main.includes("clear"))
      return "from-yellow-400 via-orange-500 to-pink-600";
    return "from-blue-500 via-indigo-500 to-purple-600";
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackground()} animate-gradient`}
    >
      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-3 tracking-wide">
            Weather Forecast
          </h1>
          <p className="text-indigo-100 text-lg">
            Get real-time weather information and forecasts 🌤️
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleUnit}
            className="bg-white/20 backdrop-blur-lg text-white px-6 py-2 rounded-xl font-semibold shadow-md border border-white/30 hover:bg-white/30 transition"
          >
            Switch to {unit === "metric" ? "°F" : "°C"}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-14 w-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-6 text-lg font-medium">
              Fetching weather data...
            </p>
          </div>
        ) : weatherData ? (
          <>
            {/* Weather + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div className="glass-card p-6">
                <WeatherCard
                  weatherData={weatherData}
                  unit={unit}
                  location={location}
                />
              </div>
              <div className="glass-card p-6">
                <Map
                  location={location}
                  weatherData={weatherData}
                  unit={unit}
                />
              </div>
            </div>

            {/* Forecast Section */}
            {forecastData && (
              <div className="glass-card p-6">
                <Forecast forecastData={forecastData} unit={unit} />
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
