'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components (avoid SSR issues)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

export default function Map({ location, weatherData, unit }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !location) {
    return (
      <div className="h-96 rounded-xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  // ✅ Handle Open-Meteo structure
  let currentTemp = null
  let description = null

  if (weatherData?.hourly) {
    currentTemp = Math.round(weatherData.hourly.temperature_2m[0])
    description = `Wind ${Math.round(weatherData.hourly.wind_speed_10m[0])} ${unit === 'metric' ? 'm/s' : 'mph'}`
  }

  return (
    <div className="h-96 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div className="text-center">
              <strong>{location.name || 'Location'}</strong>
              <br />
              {currentTemp !== null ? (
                <>
                  {currentTemp}°{unit === 'metric' ? 'C' : 'F'}
                  <br />
                  {description}
                </>
              ) : (
                <span>No weather data available</span>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
