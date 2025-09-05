"use client";

export default function WeatherCard({ weatherData, unit, location }) {
  if (!weatherData?.hourly) return null;

  const currentTemp = Math.round(weatherData.hourly.temperature_2m[0]);
  const feelsLike = currentTemp;
  const windSpeed = Math.round(weatherData.hourly.wind_speed_10m[0]);
  const humidity = weatherData.hourly.relative_humidity_2m
    ? weatherData.hourly.relative_humidity_2m[0]
    : "--";
  const pressure = weatherData.hourly.surface_pressure
    ? Math.round(weatherData.hourly.surface_pressure[0])
    : "--";

  const dataTime = weatherData.hourly.time[0];
  const formattedTime = new Date(dataTime).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto hover:scale-105 transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{location.name}</h2>
        <span className="text-sm text-gray-700">{formattedTime}</span>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-6xl font-extrabold text-gray-900 drop-shadow-lg">
            {currentTemp}°{unit === "metric" ? "C" : "F"}
          </div>
          <div className="text-gray-700 text-lg">Current forecast</div>
        </div>
        {/* Weather Icon Placeholder */}
        <div className="w-20 h-20 bg-white/70 rounded-full flex items-center justify-center shadow-md">
          <span className="text-4xl">☀️</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-200/70 p-4 rounded-xl text-center shadow-md">
          <div className="text-sm text-blue-900 mb-1">Feels Like</div>
          <div className="text-xl font-semibold text-gray-900">
            {feelsLike}°{unit === "metric" ? "C" : "F"}
          </div>
        </div>

        <div className="bg-green-200/70 p-4 rounded-xl text-center shadow-md">
          <div className="text-sm text-green-900 mb-1">Humidity</div>
          <div className="text-xl font-semibold text-gray-900">{humidity}%</div>
        </div>

        <div className="bg-yellow-200/70 p-4 rounded-xl text-center shadow-md">
          <div className="text-sm text-yellow-900 mb-1">Wind Speed</div>
          <div className="text-xl font-semibold text-gray-900">
            {windSpeed} {unit === "metric" ? "m/s" : "mph"}
          </div>
        </div>

        <div className="bg-purple-200/70 p-4 rounded-xl text-center shadow-md">
          <div className="text-sm text-purple-900 mb-1">Pressure</div>
          <div className="text-xl font-semibold text-gray-900">{pressure} hPa</div>
        </div>
      </div>
    </div>
  );
}
