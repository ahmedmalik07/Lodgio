'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { User, LogIn, LogOut, UserPlus, Mail, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Auth Context
interface AuthContextType {
  user: any | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>
  signInAnonymously: () => Promise<void>
  signOut: () => Promise<void>
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

  const signUpWithEmail = async (email: string, password: string, fullName: string = '') => {
    try {
      const response = await fetch('http://localhost:8000/auth/email/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName
        })
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        setUser(data.user)
        if (data.session?.access_token) {
          localStorage.setItem('supabase_token', data.session.access_token)
        }
      } else {
        throw new Error(data.error || 'Sign up failed')
      }
    } catch (error) {
      console.error('Email sign up failed:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/auth/email/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        setUser(data.user)
        if (data.session?.access_token) {
          localStorage.setItem('supabase_token', data.session.access_token)
        }
      } else {
        throw new Error(data.error || 'Sign in failed')
      }
    } catch (error) {
      console.error('Email sign in failed:', error)
      throw error
    }
  }

  const signInAnonymously = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        setUser(data.user)
        if (data.session?.access_token) {
          localStorage.setItem('supabase_token', data.session.access_token)
        }
      } else {
        throw new Error(data.error || 'Anonymous sign in failed')
      }
    } catch (error) {
      console.error('Anonymous sign in failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch('http://localhost:8000/auth/signout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Sign out API call failed:', error)
    }
    
    localStorage.removeItem('supabase_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInAnonymously,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Email Auth Form Component
export function EmailAuthForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { signInWithEmail, signUpWithEmail, signInAnonymously } = useAuth()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName)
      } else {
        await signInWithEmail(email, password)
      }
      // Success - redirect to provider listing page
      if (onSuccess) {
        onSuccess() // Close modal if callback provided
      }
      router.push('/provider') // Navigate to listing page
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    }

    setLoading(false)
  }

  const handleAnonymousSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      await signInAnonymously()
      // Success - redirect to provider listing page
      if (onSuccess) {
        onSuccess() // Close modal if callback provided
      }
      router.push('/provider') // Navigate to listing page
    } catch (error: any) {
      setError(error.message || 'Anonymous access failed')
    }

    setLoading(false)
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isSignUp ? 'Join our roommate community' : 'Welcome back!'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </motion.button>
      </form>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <motion.button
          onClick={handleAnonymousSignIn}
          disabled={loading}
          className="w-full mt-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors border border-gray-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue as Guest
        </motion.button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </motion.div>
  )
}

// User Profile Display Component
export function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <motion.div 
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-blue-100 rounded-full p-2">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-900">
          {user.name || 'Anonymous User'}
        </p>
        {user.email && (
          <p className="text-xs text-gray-500">{user.email}</p>
        )}
      </div>
      <motion.button
        onClick={signOut}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

// Auth Button Component (for login/signup triggers)
export function AuthButton() {
  const { user } = useAuth()
  
  if (user) {
    return <UserProfile />
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </motion.button>
    </div>
  )
}

// Email Auth Modal Component
export function EmailAuthModal({ isOpen, onCloseAction }: { isOpen: boolean; onCloseAction: () => void }) {
  if (!isOpen) return null

  const handleBackdropClick = () => {
    onCloseAction()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <EmailAuthForm onSuccess={onCloseAction} />
      </div>
    </div>
  )
}

export default EmailAuthForm