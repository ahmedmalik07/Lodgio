'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Home, Search, Star, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth, UserProfile, EmailAuthModal } from '../components/EmailAuth'

export default function HomePage() {
  const [userType, setUserType] = useState<'seeker' | 'provider' | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  RoomMate Matcher
                </h1>
                <p className="text-xs text-gray-600 font-urdu">رُوم میٹ میچر</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                How It Works
              </a>
              <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                About
              </Link>
              
              {/* Authentication UI */}
              {!loading && (
                user ? (
                  <UserProfile />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Find Your Perfect
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {" "}RoomMate
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                AI-powered matching for Pakistani students. Whether you&apos;re looking for a roommate or offering accommodation, 
                our advanced algorithms find the perfect match based on lifestyle, preferences, and compatibility.
              </p>
              <p className="text-sm font-urdu text-gray-500">
                پاکستانی طلباء کے لیے ذہین رُوم میٹ میچنگ سسٹم
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">I&apos;m looking for:</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/seeker">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 min-w-[200px]"
                    >
                      <Search className="h-5 w-5" />
                      <div className="text-left">
                        <div>A Roommate</div>
                        <div className="text-xs font-urdu opacity-90">رُوم میٹ تلاش کریں</div>
                      </div>
                    </motion.button>
                  </Link>

                  <Link href="/provider">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 min-w-[200px]"
                    >
                      <Home className="h-5 w-5" />
                      <div className="text-left">
                        <div>List My Room</div>
                        <div className="text-xs font-urdu opacity-90">کمرہ کرائے پر دیں</div>
                      </div>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-primary-200 rounded-full p-4"
          >
            <Users className="h-8 w-8 text-primary-600" />
          </motion.div>
        </div>
        <div className="absolute top-40 right-10 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="bg-secondary-200 rounded-full p-4"
          >
            <Home className="h-8 w-8 text-secondary-600" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RoomMate Matcher?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform understands Pakistani student culture and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200"
            >
              <div className="bg-primary-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Advanced AI considers sleep schedules, study habits, cleanliness, and cultural preferences
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200"
            >
              <div className="bg-secondary-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Built-in red flag detection and compatibility analysis ensures safe matches
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
            >
              <div className="bg-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pakistani Context</h3>
              <p className="text-gray-600">
                Understands local culture, food preferences, and lifestyle needs of Pakistani students
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to find your perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Share your preferences, lifestyle, and what you're looking for",
                icon: Users
              },
              {
                step: "2", 
                title: "AI Analysis",
                description: "Our smart algorithms analyze compatibility factors",
                icon: Star
              },
              {
                step: "3",
                title: "Get Matches",
                description: "Receive personalized matches with compatibility scores",
                icon: CheckCircle
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <item.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mt-4 transform rotate-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of Pakistani students who found their ideal living situation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seeker">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Find Roommate
                </motion.button>
              </Link>
              <Link href="/provider">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  List Property
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">RoomMate Matcher</span>
              </div>
              <p className="text-gray-400 mb-3">
                AI-powered roommate matching for Pakistani students
              </p>
              <p className="text-primary-400 font-medium text-sm italic">
                "Connecting Hearts, Creating Homes"
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/seeker" className="hover:text-white transition-colors">Find Roommate</Link></li>
                <li><Link href="/provider" className="hover:text-white transition-colors">List Property</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories & Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support & Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/guidelines" className="hover:text-white transition-colors">Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Team</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>Ahmed Malik (Lead) - Air University</li>
                <li>Salma Saleem - GIKI</li>
                <li>Fatima - FAST University</li>
                <li>Moawiz - FAST University</li>
                <li>Rabia - Bahria University</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">Built with AI & passion in Pakistan 🇵🇰</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RoomMate Matcher. Built with Google ADK Multi-Agent System.</p>
            <p className="text-xs mt-2">Empowering Pakistani students with AI-driven accommodation solutions</p>
          </div>
        </div>
      </footer>
      
      {/* Authentication Modal */}
      <EmailAuthModal 
        isOpen={showAuthModal} 
        onCloseAction={() => setShowAuthModal(false)} 
      />
    </div>
  )
}