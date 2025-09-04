'use client'

import { useState, useEffect } from 'react'
import WeatherCard from './components/WeatherCard'
import Map from './components/Map'
import SearchBar from './components/SearchBar'
import Forecast from './components/Forecast'

export default function Home() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'New York' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('metric')

  useEffect(() => {
    // Fetch user's current location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const name = await reverseGeocode(latitude, longitude)
          setLocation({ lat: latitude, lng: longitude, name })
          fetchWeatherData(latitude, longitude)
          fetchForecastData(latitude, longitude)
        },
        () => {
          // fallback if geolocation fails
          fetchWeatherData(location.lat, location.lng)
          fetchForecastData(location.lat, location.lng)
        }
      )
    } else {
      fetchWeatherData(location.lat, location.lng)
      fetchForecastData(location.lat, location.lng)
    }
  }, [])

  // Reverse geocode coordinates to get city name
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      return data.address.city || data.address.town || data.address.village || 'Unknown Location'
    } catch (err) {
      console.error('Reverse geocode error:', err)
      return 'Unknown Location'
    }
  }

  const fetchWeatherData = async (lat, lng) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}&units=${unit}`)
      const data = await response.json()
      if (!data || !data.hourly) throw new Error('Invalid weather data received')
      setWeatherData(data)
      setError(null)
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastData = async (lat, lng) => {
    try {
      const response = await fetch(`/api/forecast?lat=${lat}&lon=${lng}&units=${unit}`)
      const data = await response.json()
      if (!data || !data.hourly) throw new Error('Invalid forecast data received')
      setForecastData(data)
    } catch (err) {
      console.error('Forecast fetch error:', err)
    }
  }

  // Handle search from SearchBar
  const handleSearch = async (searchLocation) => {
    console.log('I am running buddy');
    
    if (searchLocation.lat && searchLocation.lng) {
      let cityName = searchLocation.name
      console.log(cityName,searchLocation.name);
      
      // Optional: reverse geocode if name not provided
      if (!cityName) cityName = await reverseGeocode(searchLocation.lat, searchLocation.lng)

      const newLocation = { lat: searchLocation.lat, lng: searchLocation.lng, name: cityName }
      setLocation(newLocation)
      setWeatherData(null)
      setForecastData(null)
      setError(null)
      setLoading(true)

      fetchWeatherData(searchLocation.lat, searchLocation.lng)
      fetchForecastData(searchLocation.lat, searchLocation.lng)
    }
  }

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    if (location) {
      fetchWeatherData(location.lat, location.lng)
      fetchForecastData(location.lat, location.lng)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Forecast</h1>
          <p className="text-blue-100">Get real-time weather information and forecasts</p>
        </header>

        <SearchBar onSearch={handleSearch} />

        <div className="flex justify-center mb-4">
          <button
            onClick={toggleUnit}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-50 transition-colors"
          >
            Switch to {unit === 'metric' ? '°F' : '°C'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading weather data...</p>
          </div>
        ) : weatherData ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <WeatherCard weatherData={weatherData} unit={unit} location={location} />
              <Map location={location} weatherData={weatherData} />
            </div>
            {forecastData && <Forecast forecastData={forecastData} unit={unit} />}
          </>
        ) : null}
      </main>
    </div>
  )
}
