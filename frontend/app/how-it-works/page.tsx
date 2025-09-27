'use client'

import { motion } from 'framer-motion'
import { Users, Search, Brain, Shield, Heart, ArrowLeft, CheckCircle, Star, MessageSquare, Home, Target } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Tell us about yourself, your lifestyle, preferences, and what you're looking for in a roommate or accommodation.",
      details: [
        "Personal information and contact details",
        "Lifestyle preferences (sleep schedule, cleanliness, social habits)",
        "Study habits and academic schedule",
        "Food preferences and dietary requirements",
        "Budget range and location preferences"
      ],
      icon: <Users className="h-8 w-8 text-primary-600" />,
      color: "from-primary-600 to-primary-700"
    },
    {
      step: 2,
      title: "AI Profile Analysis", 
      description: "Our intelligent Profile Reader Agent analyzes your information and creates a comprehensive compatibility profile.",
      details: [
        "Natural language processing of your preferences",
        "Lifestyle pattern recognition",
        "Compatibility factor extraction",
        "Cultural context understanding",
        "Preference weighting and scoring"
      ],
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      color: "from-blue-600 to-blue-700"
    },
    {
      step: 3,
      title: "Smart Database Search",
      description: "The Match Scorer Agent searches our database of 400+ verified profiles to find potential matches in your city.",
      details: [
        "Location-based filtering (same city/area)",
        "Role compatibility checking (seeker ↔ provider)",
        "Budget range matching",
        "Initial compatibility scoring",
        "Availability status verification"
      ],
      icon: <Search className="h-8 w-8 text-green-600" />,
      color: "from-green-600 to-green-700"
    },
    {
      step: 4,
      title: "Compatibility Scoring",
      description: "Advanced algorithms calculate compatibility scores across 15+ factors to identify the best matches.",
      details: [
        "Sleep schedule alignment (25 points)",
        "Cleanliness standards match (25 points)",
        "Noise tolerance compatibility (20 points)",
        "Study habits alignment (15 points)",
        "Food preferences match (10 points)",
        "Budget compatibility (5 points)"
      ],
      icon: <Target className="h-8 w-8 text-purple-600" />,
      color: "from-purple-600 to-purple-700"
    },
    {
      step: 5,
      title: "Risk Assessment",
      description: "The Red Flag Detector Agent analyzes potential conflicts and compatibility issues to ensure safe matches.",
      details: [
        "Lifestyle conflict detection",
        "Schedule incompatibility warnings",
        "Cleanliness mismatch alerts",
        "Social preference conflicts",
        "Safety concern identification"
      ],
      icon: <Shield className="h-8 w-8 text-red-600" />,
      color: "from-red-600 to-red-700"
    },
    {
      step: 6,
      title: "Personalized Recommendations",
      description: "The Wingman Agent provides friendly advice, conversation starters, and next-step guidance for each match.",
      details: [
        "Ice-breaker conversation suggestions",
        "Meeting arrangement advice",
        "Compatibility highlight explanations",
        "Cultural context considerations",
        "Safety meeting recommendations"
      ],
      icon: <MessageSquare className="h-8 w-8 text-pink-600" />,
      color: "from-pink-600 to-pink-700"
    }
  ]

  const benefits = [
    {
      title: "Time-Saving",
      description: "No more endless browsing through incompatible profiles. Get targeted matches in seconds.",
      icon: "⏰"
    },
    {
      title: "Safety First",
      description: "Background screening and red flag detection for secure living arrangements.",
      icon: "🛡️"
    },
    {
      title: "Cultural Fit",
      description: "Matches consider Pakistani cultural values and student lifestyle needs.",
      icon: "🇵🇰"
    },
    {
      title: "Transparency",
      description: "See exactly why each match was recommended with detailed compatibility analysis.",
      icon: "🔍"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  RoomMate Matcher
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How 
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {" "}It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how our AI-powered multi-agent system finds your perfect roommate through 
              intelligent analysis and compatibility matching.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4`}>
                      {step.step}
                    </div>
                    <div>{step.icon}</div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What happens in this step:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                    <div className={`w-full h-64 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                      <div className="text-white text-6xl">
                        {step.icon}
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Step {step.step}</h4>
                      <p className="text-gray-600">{step.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our AI Matching?</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced AI system provides benefits that traditional roommate finding methods simply cannot match.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility Scoring Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Compatibility Scoring Breakdown</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes 15+ factors and assigns weighted scores to determine overall compatibility.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { factor: "Sleep Schedule", points: 25, description: "Early riser vs night owl compatibility" },
              { factor: "Cleanliness", points: 25, description: "Organized, average, or relaxed cleanliness levels" },
              { factor: "Noise Tolerance", points: 20, description: "Quiet, moderate, or loud environment preferences" },
              { factor: "Study Habits", points: 15, description: "Library, room, group study preferences" },
              { factor: "Food Preferences", points: 10, description: "Cooking habits and dietary requirements" },
              { factor: "Budget Alignment", points: 5, description: "Rent and expense compatibility" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">{item.factor}</h4>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.points} pts
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.points * 4}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Experience AI-Powered Matching?
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of Pakistani students who have found their perfect roommates through our intelligent matching system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seeker">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Finding Roommates
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Learn More About Us
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
    </div>
  )
}