'use client'

import { motion } from 'framer-motion'
import { Users, Brain, Target, Shield, Heart, ArrowLeft, Star, Award, Globe, Zap } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "AI Agent System",
      role: "Multi-Agent Intelligence",
      description: "Powered by Google ADK framework with 5 specialized agents working in harmony",
      icon: <Brain className="h-8 w-8 text-primary-600" />
    },
    {
      name: "Profile Analysis Engine", 
      role: "Deep Learning Matcher",
      description: "Advanced algorithms analyze 15+ compatibility factors for perfect matches",
      icon: <Target className="h-8 w-8 text-secondary-600" />
    },
    {
      name: "Cultural Intelligence",
      role: "Pakistani Context Expert", 
      description: "Built specifically for Pakistani students with cultural sensitivity and local insights",
      icon: <Heart className="h-8 w-8 text-pink-600" />
    }
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Safety First",
      description: "Background verification, red flag detection, and safety recommendations"
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Pakistan-Wide Coverage",
      description: "Serving major cities: Karachi, Lahore, Islamabad, Peshawar, Multan, and more"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Instant Matching",
      description: "AI-powered matching in seconds with detailed compatibility analysis"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      title: "Proven Success",
      description: "High success rate with detailed reasoning and transparent decision-making"
    }
  ]

  const stats = [
    { number: "5", label: "AI Agents", description: "Working together for perfect matches" },
    { number: "15+", label: "Compatibility Factors", description: "Analyzed for each match" },
    { number: "400+", label: "Active Profiles", description: "Pakistani students nationwide" },
    { number: "92%", label: "Success Rate", description: "Satisfied users finding matches" }
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
                <p className="text-xs text-gray-600 font-urdu">رُوم میٹ میچر</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About 
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {" "}RoomMate Matcher
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
              Pakistan&apos;s first AI-powered roommate matching platform built specifically for students. 
              Using advanced multi-agent intelligence to create perfect living partnerships.
            </p>
            <p className="text-lg font-urdu text-gray-500">
              پاکستان کا پہلا ذہین رُوم میٹ میچنگ پلیٹ فارم - طلباء کے لیے خاص طور پر بنایا گیا
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize student accommodation in Pakistan by using artificial intelligence 
                to create meaningful, compatible living partnerships that enhance academic success 
                and personal growth.
              </p>
              <p className="text-gray-600 mb-6">
                We understand the unique challenges Pakistani students face when finding suitable 
                accommodation and compatible roommates. Our AI system considers cultural values, 
                lifestyle preferences, study habits, and personal compatibility to ensure 
                successful living arrangements.
              </p>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
                <p className="text-primary-700 font-medium">
                  "Creating harmonious living spaces where Pakistani students can thrive academically 
                  and personally through intelligent compatibility matching."
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-3">{feature.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Powered by AI Intelligence</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our multi-agent system combines the power of Google ADK framework with specialized AI agents, 
              each focused on different aspects of compatibility analysis.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">{member.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">The Science Behind Matching</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: "1", title: "Profile Analysis", desc: "AI analyzes your lifestyle preferences and requirements" },
              { step: "2", title: "Database Search", desc: "Searches 400+ verified student profiles nationwide" },
              { step: "3", title: "Compatibility Scoring", desc: "Calculates compatibility across 15+ factors" },
              { step: "4", title: "Risk Assessment", desc: "Identifies potential red flags and concerns" },
              { step: "5", title: "Smart Recommendations", desc: "Provides personalized matching advice" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Safety & Trust</h4>
              <p className="text-gray-600">
                Every profile is verified and our AI actively screens for potential red flags 
                to ensure safe living arrangements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Cultural Sensitivity</h4>
              <p className="text-gray-600">
                Built with deep understanding of Pakistani culture, values, and student life, 
                ensuring culturally appropriate matches.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Intelligence & Innovation</h4>
              <p className="text-gray-600">
                Constantly improving our AI algorithms to provide better matches and 
                more accurate compatibility predictions.
              </p>
            </div>
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
              Ready to Find Your Perfect Roommate?
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of Pakistani students who have found their ideal living companions through our AI-powered matching system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seeker">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Find a Roommate
                </motion.button>
              </Link>
              <Link href="/provider">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  List Your Room
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}