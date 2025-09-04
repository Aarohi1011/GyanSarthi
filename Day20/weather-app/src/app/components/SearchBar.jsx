'use client'

import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch city suggestions from OpenWeatherMap geocoding API
  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        )
        const data = await response.json()
        setSuggestions(data || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    } else {
      setSuggestions([])
    }
  }

  // When a user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(`${suggestion.name}${suggestion.state ? ', ' + suggestion.state : ''}, ${suggestion.country}`)
    setSuggestions([])
    onSearch({
      lat: suggestion.lat,
      lng: suggestion.lon,
      name: suggestion.name
    })
  }

  // Submit first suggestion if user presses Enter
  const handleSubmit = (e) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0])
    }
  }

  return (
    <div className="relative mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.name}</div>
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
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        </div>
      )}
    </div>
  )
}
