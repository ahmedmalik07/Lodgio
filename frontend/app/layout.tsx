import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ChatBot from '../components/ChatBot'
import { AuthProvider } from '../components/EmailAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoomMate Matcher - Find Your Perfect Pakistani Roommate',
  description: 'AI-powered roommate matching for Pakistani students. Find compatible roommates or list your accommodation with advanced matching algorithms.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ChatBot />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}