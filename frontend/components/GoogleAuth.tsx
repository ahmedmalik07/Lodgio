'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { User, LogIn, LogOut, UserPlus } from 'lucide-react'

// Auth Context
interface AuthContextType {
  user: any | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signUpWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  getAuthUrl: (type: 'signin' | 'signup') => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('supabase_token')
      if (token) {
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
        }
      }
    } catch (error) {
      console.error('Session check failed:', error)
      localStorage.removeItem('supabase_token')
    }
    setLoading(false)
  }

  const getAuthUrl = async (type: 'signin' | 'signup'): Promise<string | null> => {
    try {
      // Test connection first
      const testResponse = await fetch('http://localhost:8000/auth/test')
      const testData = await testResponse.json()
      console.log('Auth system status:', testData)
      
      const endpoint = type === 'signin' ? '/auth/google/signin' : '/auth/google/signup'
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          redirect_url: `${window.location.origin}/auth/callback`
        })
      })

      const data = await response.json()
      console.log('Auth response:', data)
      
      if (data.status === 'success') {
        return data.auth_url
      } else {
        console.error('Auth error:', data.error)
        throw new Error(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth URL generation failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Authentication failed: ${errorMessage}`)
      return null
    }
  }

  const signInWithGoogle = async () => {
    try {
      const authUrl = await getAuthUrl('signin')
      if (authUrl) {
        window.location.href = authUrl
      }
    } catch (error) {
      console.error('Google sign in failed:', error)
    }
  }

  const signUpWithGoogle = async () => {
    try {
      const authUrl = await getAuthUrl('signup')
      if (authUrl) {
        window.location.href = authUrl
      }
    } catch (error) {
      console.error('Google sign up failed:', error)
    }
  }

  const signOut = async () => {
    try {
      await fetch('http://localhost:8000/auth/signout', {
        method: 'POST'
      })
      
      localStorage.removeItem('supabase_token')
      setUser(null)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    getAuthUrl
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Google Sign In Button Component
export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth()
  
  return (
    <motion.button
      onClick={signInWithGoogle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 font-medium"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    </motion.button>
  )
}

// Google Sign Up Button Component
export function GoogleSignUpButton() {
  const { signUpWithGoogle } = useAuth()
  
  return (
    <motion.button
      onClick={signUpWithGoogle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign up with Google
    </motion.button>
  )
}

// User Profile Component
export function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-gray-700 font-medium">{user.name || user.email}</span>
      </div>
      
      <button
        onClick={signOut}
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}

// Authentication Modal Component
export function AuthModal({ isOpen, onClose, mode = 'signin' }: { 
  isOpen: boolean
  onClose: () => void
  mode?: 'signin' | 'signup'
}) {
  const [currentMode, setCurrentMode] = useState(mode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentMode === 'signin' ? 'Welcome Back' : 'Join RoomMate Matcher'}
          </h2>
          <p className="text-gray-600">
            {currentMode === 'signin' 
              ? 'Sign in to access your account and find roommates'
              : 'Create an account to start finding your perfect roommate'
            }
          </p>
        </div>

        <div className="space-y-4">
          {currentMode === 'signin' ? <GoogleSignInButton /> : <GoogleSignUpButton />}
          
          <div className="text-center">
            <button
              onClick={() => setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {currentMode === 'signin' 
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </motion.div>
    </div>
  )
}