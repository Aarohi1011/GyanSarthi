"use client";

export default function Forecast({ forecastData, unit }) {
  if (!forecastData || !forecastData.list) return null;

  // Group forecasts by day
  const dailyForecasts = {};
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });

  // Get next 5 days
  const nextDays = Object.keys(dailyForecasts).slice(0, 5);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        5-Day Forecast
      </h3>

      {/* Daily cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {nextDays.map((date, index) => {
          const dayForecasts = dailyForecasts[date];
          const dayTemp = Math.round(dayForecasts[0].main.temp);
          const nightTemp = Math.round(
            dayForecasts[dayForecasts.length - 1].main.temp
          );
          const weather = dayForecasts[0].weather[0];

          return (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:scale-105 hover:shadow-lg transition transform duration-300"
            >
              <div className="font-semibold text-blue-900 mb-2">
                {index === 0 ? "Today" : getDayName(date)}
              </div>
              <img
                src={getWeatherIcon(weather.icon)}
                alt={weather.description}
                className="w-14 h-14 mx-auto mb-2 drop-shadow-md"
              />
              <div className="text-2xl font-extrabold text-gray-900">
                {dayTemp}°{unit === "metric" ? "C" : "F"}
              </div>
              <div className="text-sm text-gray-700">
                {nightTemp}°{unit === "metric" ? "C" : "F"}
              </div>
              <div className="text-xs text-gray-600 capitalize mt-2">
                {weather.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed forecast */}
      <div className="mt-8">
        <h4 className="font-semibold text-lg text-gray-800 mb-4">
          Next 24 Hours
        </h4>
        <div className="space-y-3">
          {forecastData.list.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">
                {new Date(item.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="flex items-center">
                <img
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className="w-8 h-8"
                />
                <span className="ml-2 font-semibold text-gray-800">
                  {Math.round(item.main.temp)}°{unit === "metric" ? "C" : "F"}
                </span>
              </div>
              <span className="text-sm text-gray-600 capitalize">
                {item.weather[0].description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
