'use client'

import { motion } from 'framer-motion'
import { Users, ArrowLeft, Shield, Lock, Eye, UserCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="h-6 w-6 text-blue-600" />,
      content: [
        "Personal Information: Name, email address, phone number, university details",
        "Profile Information: Lifestyle preferences, study habits, accommodation requirements", 
        "Usage Data: How you interact with our platform, search patterns, match preferences",
        "Communication Data: Messages exchanged through our platform for safety purposes",
        "Device Information: Browser type, IP address, operating system for security"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      content: [
        "AI-Powered Matching: Create personalized roommate recommendations based on compatibility",
        "Safety & Security: Detect suspicious behavior and prevent fraudulent activities",
        "Communication: Send important updates about matches, safety alerts, and service improvements",
        "Platform Improvement: Analyze usage patterns to enhance matching algorithms",
        "Customer Support: Provide assistance and resolve issues you may encounter"
      ]
    },
    {
      title: "Information Sharing & Disclosure", 
      icon: <Lock className="h-6 w-6 text-purple-600" />,
      content: [
        "With Potential Matches: Only basic profile information needed for informed decisions",
        "Never Sold: We never sell your personal information to third parties",
        "Service Providers: Limited data sharing with trusted partners (hosting, analytics) under strict agreements",
        "Legal Requirements: Only when required by Pakistani law or court orders",
        "Safety Situations: When necessary to prevent harm or investigate suspected illegal activities"
      ]
    },
    {
      title: "Data Security & Protection",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      content: [
        "Encryption: All sensitive data is encrypted both in transit and at rest",
        "Access Controls: Strict employee access controls and regular security audits",
        "Secure Infrastructure: Industry-standard security measures and regular updates",
        "Password Protection: Strong password requirements and account security features",
        "Regular Backups: Secure data backups to prevent data loss"
      ]
    },
    {
      title: "Your Rights & Controls",
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      content: [
        "Access: Request a copy of all personal data we hold about you",
        "Correction: Update or correct any inaccurate information in your profile",
        "Deletion: Request complete deletion of your account and associated data",
        "Portability: Download your data in a structured, commonly used format",
        "Opt-out: Unsubscribe from marketing communications at any time"
      ]
    }
  ]

  const safetyTips = [
    "Never share financial information or send money to potential roommates",
    "Always meet potential roommates in public places first",
    "Verify identity through university email or official documents",
    "Trust your instincts - report suspicious behavior immediately",
    "Keep communication on our platform initially for safety records"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 hover:opacity-80 transition-opacity" />
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8" />
              <span className="text-2xl font-bold">Privacy Policy</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-6">Your Privacy Matters</h1>
            <p className="text-xl text-primary-100 mb-4">
              At RoomMate Matcher, we're committed to protecting your privacy while helping you find the perfect roommate.
            </p>
            <p className="text-lg text-primary-200">
              Last updated: January 2025 • Effective for all users in Pakistan
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
            <p className="text-gray-600 mb-4">
              RoomMate Matcher is built by Pakistani students, for Pakistani students. We understand the unique challenges of finding accommodation in Pakistan and are committed to creating a safe, transparent platform.
            </p>
            <p className="text-gray-600">
              This privacy policy explains how we collect, use, and protect your information when you use our AI-powered roommate matching service. We believe in being completely transparent about our data practices.
            </p>
          </motion.div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-8"
              >
                <div className="flex items-center mb-6">
                  {section.icon}
                  <h3 className="text-2xl font-bold text-gray-900 ml-3">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Safety Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-8 mt-8"
          >
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Safety Guidelines</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your safety is our top priority. Please follow these guidelines when using our platform:
            </p>
            <ul className="space-y-3">
              {safetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <Shield className="h-4 w-4 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white rounded-lg shadow-md p-8 mt-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Your Privacy?</h3>
            <p className="text-gray-600 mb-6">
              We're here to help! If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Privacy Officer</h4>
                <p className="text-gray-600 text-sm mb-1">Ahmed Malik</p>
                <p className="text-gray-600 text-sm">Air University, Islamabad</p>
                <p className="text-primary-600 text-sm">privacy@roommate-matcher.pk</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quick Contact</h4>
                <p className="text-gray-600 text-sm mb-1">WhatsApp: +923193608483</p>
                <p className="text-gray-600 text-sm mb-1">Response time: Usually within 24 hours</p>
                <Link href="/contact" className="text-primary-600 text-sm hover:text-primary-700 font-medium">
                  Visit our contact page →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Legal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gray-100 rounded-lg p-6 mt-8"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Legal Compliance</h4>
            <p className="text-gray-600 text-sm mb-2">
              This privacy policy complies with Pakistani data protection regulations and international best practices. 
              We operate under Pakistani jurisdiction and follow all applicable laws.
            </p>
            <p className="text-gray-600 text-sm">
              By using RoomMate Matcher, you acknowledge that you have read and understood this privacy policy and agree to our data practices as described.
            </p>
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