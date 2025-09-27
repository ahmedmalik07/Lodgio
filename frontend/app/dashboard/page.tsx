'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Home, Users, Settings, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    listings: 0,
    matches: 0,
    views: 0
  })

  useEffect(() => {
    checkAuthentication()
    loadUserStats()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('supabase_token')
      if (!token) {
        window.location.href = '/'
        return
      }

      const response = await fetch('http://localhost:8000/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('supabase_token')
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/'
    }
    setLoading(false)
  }

  const loadUserStats = async () => {
    try {
      // Load user statistics (placeholder for now)
      setStats({
        listings: 2,
        matches: 8,
        views: 45
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8000/auth/signout', {
        method: 'POST'
      })
      localStorage.removeItem('supabase_token')
      localStorage.removeItem('supabase_refresh_token')
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">RoomMate Matcher</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-2">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-primary-600 bg-primary-50 rounded-md"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Dashboard
                </a>
                <Link
                  href="/provider"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  List Property
                </Link>
                <Link
                  href="/seeker"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Find Roommates
                </Link>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white mb-6"
            >
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h2>
              <p className="opacity-90">
                Ready to find your perfect roommate or list your property?
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Your Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.listings}</p>
                  </div>
                  <Home className="w-8 h-8 text-primary-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Matches Found</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.matches}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/provider"
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Plus className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">List a Property</h4>
                    <p className="text-sm text-gray-600">Add a new room or apartment</p>
                  </div>
                </Link>

                <Link
                  href="/seeker"
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
                >
                  <Users className="w-6 h-6 text-secondary-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Find Roommates</h4>
                    <p className="text-sm text-gray-600">Search for compatible matches</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}