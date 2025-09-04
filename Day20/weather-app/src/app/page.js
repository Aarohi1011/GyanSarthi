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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }))
          fetchWeatherData(latitude, longitude)
          fetchForecastData(latitude, longitude)
        },
        () => {
          fetchWeatherData(location.lat, location.lng)
          fetchForecastData(location.lat, location.lng)
        }
      )
    } else {
      fetchWeatherData(location.lat, location.lng)
      fetchForecastData(location.lat, location.lng)
    }
  }, [])

  const fetchWeatherData = async (lat, lng) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}&units=${unit}`)
      const data = await response.json()
      
      if (data.cod !== 200) {
        throw new Error(data.message || 'Failed to fetch weather data')
      }
      
      setWeatherData(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastData = async (lat, lng) => {
    try {
      const response = await fetch(`/api/forecast?lat=${lat}&lon=${lng}&units=${unit}`)
      const data = await response.json()
      
      if (data.cod !== '200') {
        throw new Error(data.message || 'Failed to fetch forecast data')
      }
      
      setForecastData(data)
    } catch (err) {
      console.error('Error fetching forecast:', err)
    }
  }

  const handleSearch = (searchLocation) => {
    if (searchLocation.lat && searchLocation.lng) {
      setLocation(searchLocation)
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
            
            {forecastData && (
              <Forecast forecastData={forecastData} unit={unit} />
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}