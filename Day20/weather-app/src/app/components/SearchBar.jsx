"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch city suggestions from OpenWeatherMap Geocoding API
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // When a user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(
      `${suggestion.name}${suggestion.state ? ", " + suggestion.state : ""}, ${
        suggestion.country
      }`
    );
    setSuggestions([]);
    onSearch({
      lat: suggestion.lat,
      lng: suggestion.lon,
      name: suggestion.name,
    });
  };

  // Submit first suggestion if user presses Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="relative mb-6 w-full max-w-lg mx-auto">
      {/* Input + Button */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 backdrop-blur-md bg-white/60 shadow-md rounded-xl p-2"
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="flex-1 px-4 py-3 bg-transparent rounded-lg focus:outline-none text-gray-900 placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-xl overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-semibold text-gray-800">
                {suggestion.name}
              </div>
              <div className="text-sm text-gray-600">
                {suggestion.state && `${suggestion.state}, `}
                {suggestion.country}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 p-4 shadow-lg">
          <div className="flex items-center justify-center text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2"></div>
            <span>Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
}
