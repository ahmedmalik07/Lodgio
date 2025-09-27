'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('Current URL:', window.location.href)
      console.log('Hash:', window.location.hash)
      console.log('Search:', window.location.search)
      
  // Extract tokens or authorization code from URL
  let access_token: string | null = null
  let refresh_token: string | null = null
  let code: string | null = null
      
      // Check URL hash first (common for OAuth)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        access_token = hashParams.get('access_token')
        refresh_token = hashParams.get('refresh_token')
        console.log('Hash params - Access token:', !!access_token, 'Refresh token:', !!refresh_token)
      }
      
      // Check URL search params as fallback
      if (window.location.search) {
        const sp = new URLSearchParams(window.location.search)
        // If the implicit flow not used, Supabase returns ?code=...
        if (!access_token) {
          access_token = sp.get('access_token')
          refresh_token = sp.get('refresh_token')
        }
        code = sp.get('code')
        console.log('Search params - Access token:', !!access_token, 'Refresh token:', !!refresh_token, 'Code:', !!code)
      }
      
      // Send tokens to backend
      const requestBody: any = {
        callback_url: window.location.href
      }
      if (access_token) requestBody.access_token = access_token
      if (refresh_token) requestBody.refresh_token = refresh_token
      if (code) requestBody.code = code
      
  console.log('Sending to backend:', { ...requestBody, access_token: !!access_token, refresh_token: !!refresh_token, code: !!code })
      
      const response = await fetch('http://localhost:8000/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Backend response:', data)

      if (response.ok && data.status === 'success') {
        // Store tokens for future API calls
        if (data.access_token) {
          localStorage.setItem('supabase_token', data.access_token)
        }
        if (data.refresh_token) {
          localStorage.setItem('supabase_refresh_token', data.refresh_token)
        }
        
        setStatus('success')
        setMessage('Authentication successful! Redirecting...')
        setUserInfo(data.user)

        // Redirect to home page after short delay
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Authentication failed')
      }

    } catch (error) {
      console.error('Auth callback error:', error)
      setStatus('error')
      setMessage('Failed to process authentication. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Completing Authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to RoomMate Matcher!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            {userInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-3">
                  {userInfo.avatar_url && (
                    <img
                      src={userInfo.avatar_url}
                      alt={userInfo.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {userInfo.name || userInfo.email}
                    </p>
                    <p className="text-sm text-gray-600">{userInfo.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}