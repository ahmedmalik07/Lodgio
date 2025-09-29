'use client'

import { useState } from 'react'
import { Search, MapPin, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface QuickSearchProps {
  onSearch?: (city: string, results: any[]) => void
}

export default function QuickCitySearch({ onSearch }: QuickSearchProps) {
  const [city, setCity] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleQuickSearch = async () => {
    if (!city.trim()) {
      alert('Please enter a city name')
      return
    }

    setLoading(true)
    setShowResults(true)
    
    try {
      // Try the main API server first (port 8000), then fallback to simple app (port 8080)
      let response = await fetch(`http://localhost:8000/api/quick-search?city=${encodeURIComponent(city)}`)
      
      if (!response.ok) {
        // Fallback to simple Flask app
        response = await fetch(`http://localhost:8080/api/search?city=${encodeURIComponent(city)}`)
      }
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.roommates || [])
        onSearch?.(city, data.roommates || [])
      } else {
        // Fallback to static data if both servers are not available
        const fallbackResults = getFallbackResults(city)
        setResults(fallbackResults)
        onSearch?.(city, fallbackResults)
      }
    } catch (error) {
      // Server not available, use fallback data
      const fallbackResults = getFallbackResults(city)
      setResults(fallbackResults)
      onSearch?.(city, fallbackResults)
    } finally {
      setLoading(false)
    }
  }

  const getFallbackResults = (searchCity: string) => {
    const fallbackData = [
      {
        id: "r001",
        name: "Ahmed Khan",
        city: "Lahore", 
        area: "DHA Phase 5",
        budget: "15000-25000",
        preferences: "Clean and organized person, early sleeper (10 PM), no smoking, prefers quiet study environment",
        contact: "ahmed.dha@email.com | +92-300-1234567",
        posted: "2025-09-25"
      },
      {
        id: "r002", 
        name: "Fatima Ali",
        city: "Karachi",
        area: "Clifton Block 2",
        budget: "20000-30000", 
        preferences: "Social but respectful, cooking allowed, flexible with timings, female roommate preferred",
        contact: "fatima.clifton@email.com | +92-321-2345678",
        posted: "2025-09-26"
      },
      {
        id: "r003",
        name: "Hassan Shah",
        city: "Islamabad",
        area: "F-7 Sector", 
        budget: "12000-20000",
        preferences: "University student, needs study-friendly environment, budget-conscious, shared utilities",
        contact: "hassan.f7@email.com | +92-333-3456789", 
        posted: "2025-09-27"
      },
      {
        id: "r006",
        name: "Zainab Hussain",
        city: "Islamabad", 
        area: "G-11 Sector",
        budget: "14000-22000",
        preferences: "Female graduate student, quiet study hours, clean cooking habits, looking for like-minded person",
        contact: "zainab.g11@email.com | +92-335-6789012",
        posted: "2025-09-28"
      },
      {
        id: "r007",
        name: "Muhammad Tariq",
        city: "Islamabad",
        area: "G-9 Sector", 
        budget: "16000-24000",
        preferences: "Working professional, quiet hours after 10 PM, prefers vegetarian meals, non-smoker",
        contact: "tariq.g9@email.com | +92-340-7890123",
        posted: "2025-09-28"
      },
      {
        id: "r008",
        name: "Sana Ahmed",
        city: "Lahore",
        area: "Johar Town",
        budget: "13000-21000",
        preferences: "Female medical student, needs quiet study space, early riser, health-conscious lifestyle",
        contact: "sana.johar@email.com | +92-302-8901234",
        posted: "2025-09-28"
      }
    ]

    return fallbackData.filter(roommate => 
      roommate.city.toLowerCase().includes(searchCity.toLowerCase())
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-8"
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Quick City Search
          </h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            Low Bandwidth
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Find roommates by city - fast and lightweight!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city (Lahore, Karachi, Islamabad...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search
            </>
          )}
        </motion.button>
      </div>

      {/* Results Section */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-6 border-t border-blue-200 pt-4"
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Searching for roommates...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-green-600">
                  ✅ Found {results.length} roommate(s) in {city}
                </p>
              </div>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {results.map((roommate) => (
                  <div key={roommate.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <h4 className="font-semibold text-gray-900">{roommate.name}</h4>
                        {roommate.enhanced && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                            🤖 AI Enhanced
                          </span>
                        )}
                        {roommate.role && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            roommate.role === 'provider' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {roommate.role === 'provider' ? '🏠 Has Room' : '🔍 Seeking'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-blue-600 font-medium whitespace-nowrap ml-2">{roommate.budget}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">📍 {roommate.area}</p>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{roommate.preferences}</p>
                    <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded flex items-center justify-between">
                      <span className="flex-1">📞 {roommate.contact}</span>
                      {roommate.posted && (
                        <span className="text-gray-400 ml-2">📅 {roommate.posted}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  For more advanced matching, use the full search above
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600">😔 No roommates found in {city}</p>
              <p className="text-sm text-gray-500 mt-1">
                Try a different city or check the full search options above
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}