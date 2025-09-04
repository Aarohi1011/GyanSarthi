'use client'

export default function WeatherCard({ weatherData, unit, location }) {
  if (!weatherData) return null

  const { main, weather, wind, sys } = weatherData
  const currentWeather = weather[0]
  const temperature = Math.round(main.temp)
  const feelsLike = Math.round(main.feels_like)
  const windSpeed = Math.round(wind.speed)
  const humidity = main.humidity
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString()
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString()

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
        <span className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img 
            src={getWeatherIcon(currentWeather.icon)} 
            alt={currentWeather.description}
            className="w-16 h-16"
          />
          <div>
            <div className="text-4xl font-bold text-gray-800">
              {temperature}°{unit === 'metric' ? 'C' : 'F'}
            </div>
            <div className="text-gray-600 capitalize">{currentWeather.description}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Feels Like</div>
          <div className="text-lg font-semibold">{feelsLike}°{unit === 'metric' ? 'C' : 'F'}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Humidity</div>
          <div className="text-lg font-semibold">{humidity}%</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-600 mb-1">Wind Speed</div>
          <div className="text-lg font-semibold">{windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Pressure</div>
          <div className="text-lg font-semibold">{main.pressure} hPa</div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <div>
          <span className="block">Sunrise: {sunrise}</span>
          <span className="block">Sunset: {sunset}</span>
        </div>
        <div className="text-right">
          <span className="block">Min: {Math.round(main.temp_min)}°</span>
          <span className="block">Max: {Math.round(main.temp_max)}°</span>
        </div>
      </div>
    </div>
  )
}