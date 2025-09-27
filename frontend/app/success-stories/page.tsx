'use client'

import { motion } from 'framer-motion'
import { Users, Star, Quote, Heart, Home, ArrowLeft, Trophy, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      names: "Ahmed & Hassan",
      location: "Karachi, Gulshan-e-Iqbal",
      university: "NED University",
      matchDate: "March 2024",
      compatibilityScore: "94%",
      image: "👨‍🎓👨‍🎓",
      story: "I was worried about finding someone who shared my study habits and sleep schedule. The AI matched me with Hassan, and we've been perfect roommates for 8 months now. We both wake up early, keep the room organized, and study together. It's like having a study partner and friend all in one!",
      testimonial: "The AI understood exactly what I needed in a roommate. Hassan and I have the same routine, same cleanliness standards, and we even cook together. Best decision ever!",
      highlights: [
        "Both early risers (5:30 AM)",
        "Engineering students with similar study schedules", 
        "Shared love for organized living spaces",
        "Budget perfectly aligned (15k PKR each)"
      ],
      beforeAfter: {
        before: "Struggled with 3 previous incompatible roommates",
        after: "8 months of harmonious living, improved grades"
      }
    },
    {
      id: 2,
      names: "Fatima & Aisha",
      location: "Lahore, DHA",
      university: "LUMS",
      matchDate: "January 2024",
      compatibilityScore: "89%",
      image: "👩‍🎓👩‍🎓",
      story: "As medical students, we needed someone who understood the demanding schedule and study requirements. The AI matched us based on our similar academic intensity and lifestyle needs. We support each other through tough study sessions and maintain a quiet, focused environment.",
      testimonial: "Finding Aisha through RoomMate Matcher was a blessing. We both understand the medical school grind and create the perfect study environment for each other.",
      highlights: [
        "Medical students with intensive study schedules",
        "Both prefer quiet, distraction-free environments",
        "Similar sleep patterns (late to bed, late to rise)",
        "Mutual support during exam periods"
      ],
      beforeAfter: {
        before: "Living alone, struggling with motivation and costs",
        after: "Shared expenses, mutual motivation, better academic performance"
      }
    },
    {
      id: 3,
      names: "Ali & Bilal",
      location: "Islamabad, G-11",
      university: "NUST",
      matchDate: "February 2024",
      compatibilityScore: "91%",
      image: "👨‍💻👨‍💻",
      story: "Being CS students, we both have unconventional schedules with late-night coding sessions. The AI perfectly matched our night owl tendencies and understanding of tech lifestyle. We've even started a side project together!",
      testimonial: "The AI knew that two night owls would work perfectly together. Bilal and I code late into the night without disturbing each other. We've become coding partners too!",
      highlights: [
        "Computer Science students with similar interests",
        "Both night owls (sleep after 2 AM)",
        "Shared passion for technology and coding",
        "Collaborative mindset for projects"
      ],
      beforeAfter: {
        before: "Conflicts with early-riser roommates about noise",
        after: "Perfect sync, started a successful app development project"
      }
    },
    {
      id: 4,
      names: "Sara & Mariam",
      location: "Peshawar, University Town",
      university: "University of Peshawar",
      matchDate: "April 2024",
      compatibilityScore: "87%",
      image: "👩‍🏫👩‍📚",
      story: "The AI matched us based on our shared values around family, studies, and social life balance. We both come from traditional families and needed someone who understood our cultural background and respect for family values.",
      testimonial: "Mariam understands my family obligations and study commitments. We respect each other's space and values. It feels like living with a sister!",
      highlights: [
        "Strong family values and cultural understanding",
        "Balanced approach to social life and studies",
        "Mutual respect for privacy and traditions",
        "Similar food preferences (Pakistani cuisine)"
      ],
      beforeAfter: {
        before: "Homesickness and cultural adjustment issues",
        after: "Feel at home, improved focus on studies"
      }
    }
  ]

  const stats = [
    { number: "500+", label: "Successful Matches" },
    { number: "92%", label: "Satisfaction Rate" },
    { number: "8.5/10", label: "Average Compatibility" },
    { number: "6 months", label: "Average Partnership Duration" }
  ]

  const quickSuccess = [
    {
      name: "Zain",
      match: "Found roommate in 24 hours",
      score: "88%",
      location: "Karachi"
    },
    {
      name: "Ayesha", 
      match: "Perfect study partner match",
      score: "95%",
      location: "Lahore"
    },
    {
      name: "Usman",
      match: "Cultural compatibility success", 
      score: "91%",
      location: "Islamabad"
    },
    {
      name: "Hina",
      match: "Budget-friendly perfect match",
      score: "89%",
      location: "Multan"
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
              Success 
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {" "}Stories
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Real stories from Pakistani students who found their perfect roommates through our AI-powered matching system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Featured Success Stories</h3>
            <p className="text-lg text-gray-600">
              Discover how our AI brought together perfect roommate partnerships
            </p>
          </motion.div>

          <div className="space-y-16">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{story.image}</div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">{story.names}</h4>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{story.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">Matched in {story.matchDate}</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {story.compatibilityScore} Match
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Quote className="h-6 w-6 text-primary-600 mb-2" />
                      <p className="text-gray-700 italic mb-4">&ldquo;{story.testimonial}&rdquo;</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Key Compatibility Factors:</h5>
                        <ul className="space-y-2">
                          {story.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start">
                              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Transformation:</h5>
                        <div className="space-y-3">
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-red-700 font-medium mb-1">BEFORE</p>
                            <p className="text-sm text-red-600">{story.beforeAfter.before}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-green-700 font-medium mb-1">AFTER</p>
                            <p className="text-sm text-green-600">{story.beforeAfter.after}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Their Story</h5>
                    <p className="text-gray-700 leading-relaxed mb-6">{story.story}</p>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">University</p>
                          <p className="font-semibold text-gray-900">{story.university}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Match Quality</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5 ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Success Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Quick Success Highlights</h3>
            <p className="text-lg text-gray-600">
              More amazing matches happening every day across Pakistan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickSuccess.map((success, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{success.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{success.match}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{success.score}</span>
                  <span className="text-gray-500">{success.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">What Our Users Say</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The AI understood my personality better than I did. My roommate and I are still best friends after graduation!",
                name: "Amina K.",
                location: "Karachi"
              },
              {
                quote: "No more awkward roommate interviews. The AI did all the work and found my perfect study partner.",
                name: "Hassan M.",
                location: "Lahore"  
              },
              {
                quote: "Cultural compatibility was so important to me. The AI matched me with someone who shares my values.",
                name: "Fatima S.",
                location: "Islamabad"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <Quote className="h-6 w-6 text-primary-600 mb-4" />
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Affordable Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for your budget</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ₨0 <span className="text-lg text-gray-500">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  AI-powered matching
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Up to 5 matches/month
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic compatibility analysis
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Safety red flag detection
                </li>
              </ul>
              <Link href="/seeker">
                <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Get Started Free
                </button>
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-8 border-2 border-primary-500 relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-3xl font-bold text-primary-600 mb-4">
                ₨500 <span className="text-lg text-gray-500">per month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Free
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited matches
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Detailed compatibility breakdown
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority matching algorithm
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  WhatsApp support
                </li>
              </ul>
              <Link href="/seeker">
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Start Premium Trial
                </button>
              </Link>
            </motion.div>

            {/* University Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">University</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                Custom <span className="text-lg text-gray-500">pricing</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Premium
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Bulk student licensing
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  University dashboard
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Dedicated support
                </li>
              </ul>
              <Link href="/contact">
                <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Contact Sales
                </button>
              </Link>
            </motion.div>
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
              Ready to Write Your Success Story?
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Join hundreds of Pakistani students who have found their perfect roommates. Your success story could be next!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seeker">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Find Your Perfect Match
                </motion.button>
              </Link>
              <Link href="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Learn How It Works
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