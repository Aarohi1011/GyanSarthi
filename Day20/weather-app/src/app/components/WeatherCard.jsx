'use client'

export default function WeatherCard({ weatherData, unit, location }) {
  if (!weatherData?.hourly) return null
  console.log(weatherData,unit,location);
  
  const currentTemp = Math.round(weatherData.hourly.temperature_2m[0])
  const feelsLike = currentTemp // Open-Meteo doesn’t give feels_like, so just use temp
  const windSpeed = Math.round(weatherData.hourly.wind_speed_10m[0])
  const humidity = weatherData.hourly.relative_humidity_2m
    ? weatherData.hourly.relative_humidity_2m[0]
    : '--'
  const pressure = weatherData.hourly.surface_pressure
    ? Math.round(weatherData.hourly.surface_pressure[0])
    : '--'

  const dataTime = weatherData.hourly.time[0]
  const formattedTime = new Date(dataTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
        <span className="text-sm text-gray-600">{formattedTime}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-4xl font-bold text-gray-800">
            {currentTemp}°{unit === 'metric' ? 'C' : 'F'}
          </div>
          <div className="text-gray-600">Current forecast</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Feels Like</div>
          <div className="text-lg font-semibold">
            {feelsLike}°{unit === 'metric' ? 'C' : 'F'}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Humidity</div>
          <div className="text-lg font-semibold">{humidity}%</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-600 mb-1">Wind Speed</div>
          <div className="text-lg font-semibold">
            {windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Pressure</div>
          <div className="text-lg font-semibold">{pressure} hPa</div>
        </div>
      </div>
    </div>
  )
}
