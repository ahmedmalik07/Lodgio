'use client'

import { motion } from 'framer-motion'
import { Users, ArrowLeft, DollarSign, CheckCircle, Star, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "Forever",
      description: "Perfect for students just getting started",
      features: [
        "AI-powered roommate matching",
        "Up to 5 matches per month",
        "Basic compatibility analysis", 
        "Safety red flag detection",
        "Cultural context matching",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Premium", 
      price: "500",
      period: "per month",
      description: "For serious students seeking the best matches",
      features: [
        "Everything in Free plan",
        "Unlimited matches",
        "Detailed compatibility breakdown",
        "Priority matching algorithm",
        "Advanced filtering options",
        "WhatsApp support",
        "Success guarantee*"
      ],
      cta: "Start Premium Trial",
      popular: true,
      color: "from-primary-600 to-secondary-600"
    },
    {
      name: "University Partnership",
      price: "Custom",
      period: "per institution", 
      description: "Bulk licensing for educational institutions",
      features: [
        "Everything in Premium plan",
        "Bulk student registration",
        "Institution dashboard", 
        "Custom branding options",
        "Dedicated account manager",
        "24/7 phone support",
        "Integration with student systems"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-purple-600 to-pink-600"
    }
  ]

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
              <Users className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-primary-600">RoomMate Matcher</span>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent 
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {" "}Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Choose the plan that works best for you. All plans include our core AI matching technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-4 ring-primary-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === "Custom" ? "Custom" : `₨${plan.price}`}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-gradient-to-r ${plan.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              * Success guarantee: Get your money back if you don't find a compatible roommate within 30 days
            </p>
            <p className="text-sm text-gray-500">
              All prices in Pakistani Rupees (PKR). Plans can be cancelled anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}