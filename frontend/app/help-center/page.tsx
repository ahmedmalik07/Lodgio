'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Shield, 
  User, 
  MessageCircle, 
  Settings, 
  CreditCard, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  Mail, 
  Users 
} from 'lucide-react'

const quickActions = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of finding roommates',
    icon: <BookOpen className="h-6 w-6 text-primary-600" />,
    action: 'Start Tutorial',
    link: '/getting-started'
  },
  {
    title: 'Safety Guidelines',
    description: 'Stay safe while meeting potential roommates',
    icon: <Shield className="h-6 w-6 text-green-600" />,
    action: 'View Guidelines',
    link: '/safety'
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
    action: 'Get Help',
    link: '/contact'
  }
]

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using RoomMate Matcher',
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    count: 8,
    articles: [
      { title: 'How to create your profile', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Setting up your preferences', readTime: '5 min', difficulty: 'Beginner' },
      { title: 'Understanding compatibility scores', readTime: '4 min', difficulty: 'Intermediate' },
      { title: 'Your first roommate search', readTime: '6 min', difficulty: 'Beginner' },
      { title: 'Using advanced filters', readTime: '7 min', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Security',
    description: 'Stay safe while meeting potential roommates',
    icon: <Shield className="h-8 w-8 text-green-600" />,
    count: 6,
    articles: [
      { title: 'Meeting roommates safely', readTime: '5 min', difficulty: 'Essential' },
      { title: 'Red flags to watch out for', readTime: '4 min', difficulty: 'Essential' },
      { title: 'Verifying identity documents', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Reporting suspicious behavior', readTime: '2 min', difficulty: 'Beginner' },
      { title: 'Emergency contacts and procedures', readTime: '4 min', difficulty: 'Essential' }
    ]
  },
  {
    id: 'account',
    title: 'Account Management',
    description: 'Manage your profile and account settings',
    icon: <User className="h-8 w-8 text-purple-600" />,
    count: 7,
    articles: [
      { title: 'Updating your profile information', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Managing privacy settings', readTime: '4 min', difficulty: 'Intermediate' },
      { title: 'Changing your password', readTime: '2 min', difficulty: 'Beginner' },
      { title: 'Deleting your account', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Email notification preferences', readTime: '3 min', difficulty: 'Beginner' }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Tips for effective roommate communication',
    icon: <MessageCircle className="h-8 w-8 text-orange-600" />,
    count: 5,
    articles: [
      { title: 'Best practices for messaging', readTime: '4 min', difficulty: 'Beginner' },
      { title: 'Scheduling meet-ups', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Video call guidelines', readTime: '5 min', difficulty: 'Intermediate' },
      { title: 'Handling difficult conversations', readTime: '6 min', difficulty: 'Advanced' },
      { title: 'Building trust with roommates', readTime: '7 min', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Troubleshoot common technical issues',
    icon: <Settings className="h-8 w-8 text-gray-600" />,
    count: 9,
    articles: [
      { title: 'App not loading properly', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Upload photo issues', readTime: '4 min', difficulty: 'Beginner' },
      { title: 'Login and authentication problems', readTime: '5 min', difficulty: 'Intermediate' },
      { title: 'Browser compatibility', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Mobile app troubleshooting', readTime: '4 min', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Pricing',
    description: 'Information about pricing and payments',
    icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
    count: 4,
    articles: [
      { title: 'Understanding pricing plans', readTime: '4 min', difficulty: 'Beginner' },
      { title: 'Student discounts available', readTime: '3 min', difficulty: 'Beginner' },
      { title: 'Payment methods accepted', readTime: '2 min', difficulty: 'Beginner' },
      { title: 'Refund and cancellation policy', readTime: '5 min', difficulty: 'Intermediate' }
    ]
  }
]

const faqData = [
  {
    question: 'How does the roommate matching work?',
    answer: 'Our AI-powered system analyzes your preferences, lifestyle, study habits, and personality traits to find compatible roommates. We consider factors like cleanliness, noise tolerance, study schedules, and social preferences to create meaningful matches.',
    category: 'Getting Started'
  },
  {
    question: 'Is RoomMate Matcher free to use?',
    answer: 'Yes! We offer a free tier that allows you to create a profile, browse potential roommates, and make basic connections. Premium features like advanced filtering and priority matching are available with our paid plans.',
    category: 'Billing'
  },
  {
    question: 'How can I ensure my safety when meeting potential roommates?',
    answer: 'Always meet in public places, inform friends or family about your meetings, verify identity documents, trust your instincts, and use our in-app reporting system for any concerning behavior.',
    category: 'Safety'
  },
  {
    question: 'Can I change my preferences after creating my profile?',
    answer: 'Absolutely! You can update your preferences, lifestyle information, and profile details anytime from your account settings. The system will automatically update your compatibility scores.',
    category: 'Account'
  },
  {
    question: 'What universities are supported?',
    answer: 'We support students from major Pakistani universities including NUST, LUMS, GIKI, Air University, FAST, Bahria University, and many others. The platform is designed specifically for Pakistani students.',
    category: 'Getting Started'
  },
  {
    question: 'How do I report inappropriate behavior?',
    answer: 'Use the report button on any profile or message. Our moderation team reviews all reports within 24 hours. Serious violations result in immediate account suspension.',
    category: 'Safety'
  },
  {
    question: 'Can I use the platform if I\'m looking for a room instead of a roommate?',
    answer: 'Yes! Our platform serves both room seekers and room providers. You can switch between modes in your profile settings to find rooms or list available spaces.',
    category: 'Getting Started'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit/debit cards, mobile wallets like JazzCash and Easypaisa, and bank transfers. All payments are processed securely.',
    category: 'Billing'
  }
]

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return categories
    return categories.filter(category => category.id === selectedCategory)
  }, [selectedCategory])

  const filteredFAQ = useMemo(() => {
    if (!searchTerm) return faqData
    return faqData.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">Help Center</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  href={action.link}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-primary-500"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-primary-100 p-2 rounded-lg mr-3">
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{action.description}</p>
                  <div className="flex items-center text-primary-600 font-medium">
                    <span>{action.action}</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {category.icon}
                  <div className="ml-3">
                    <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-gray-500 text-sm">{category.count} articles</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                
                <div className="space-y-3">
                  {category.articles.slice(0, 4).map((article, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{article.readTime}</span>
                          <span className="mx-2">•</span>
                          <span>{article.difficulty}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                
                {category.articles.length > 4 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      View all {category.count} articles →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </motion.div>

          <div className="space-y-6">
            {filteredFAQ.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 text-primary-600 mr-2" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                <div className="mt-3">
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                    {faq.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFAQ.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any articles matching "{searchTerm}"
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
            </div>
          )}
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
              Still need help?
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Our support team is here to help you succeed in finding the perfect roommate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/923193608483"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Support
              </a>
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Us
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