'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Search, User, MapPin, DollarSign, Clock, Sparkles, Home, Users, Star, Brain } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface SeekerFormData {
  name: string
  city: string
  area: string
  budget_min: number
  budget_max: number
  sleep_schedule: string
  cleanliness: string
  noise_tolerance: string
  study_habits: string
  food_pref: string
  additional_preferences: string
}

const pakistaniCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
]

export default function SeekerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [agentProgress, setAgentProgress] = useState<any[]>([])
  const [detailedAgentReasoning, setDetailedAgentReasoning] = useState<any[]>([])
  const [agentSummary, setAgentSummary] = useState<any>(null)
  const [showDetailedReasoning, setShowDetailedReasoning] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<SeekerFormData>()
  const watchedCity = watch('city')

  const onSubmit = async (data: SeekerFormData) => {
    setIsLoading(true)
    setCurrentStep(3)
    setAgentProgress([])
    
    try {
      // Create profile text similar to the dataset format
      const profileText = `Name: ${data.name}. Location: ${data.city}, ${data.area}. Budget: ${data.budget_min}-${data.budget_max} PKR. Sleep: ${data.sleep_schedule}. Cleanliness: ${data.cleanliness}. Noise: ${data.noise_tolerance}. Study: ${data.study_habits}. Food: ${data.food_pref}. Additional: ${data.additional_preferences || 'None specified'}.`
      
      const payload = {
        profile_text: profileText,
        city: data.city,
        area: data.area,
        budget_PKR: `${data.budget_min}-${data.budget_max}`,
        role: 'seeker'
      }

      // Call the agent system
      const response = await fetch('http://localhost:8000/find-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Simulate detailed agent progress with reasoning
      const agentSteps = [
        {
          agent: 'Profile Reader',
          message: 'Reading and parsing your profile...',
          reasoning: `Analyzing profile for ${data.name} in ${data.city}, ${data.area}. Budget range: ${data.budget_min}-${data.budget_max} PKR. Extracting key lifestyle preferences: sleep schedule (${data.sleep_schedule}), cleanliness (${data.cleanliness}), noise tolerance (${data.noise_tolerance}), study habits (${data.study_habits}), food preferences (${data.food_pref}).`
        },
        {
          agent: 'Match Scorer', 
          message: 'Calculating compatibility scores...',
          reasoning: `Searching database for profiles in ${data.city} within budget range. Found 15 potential matches. Analyzing compatibility factors: lifestyle alignment, schedule compatibility, cleanliness standards match, study environment needs, and food preference overlap. Applying weighted scoring algorithm.`
        },
        {
          agent: 'Red Flag Detector',
          message: 'Analyzing potential conflicts...',
          reasoning: `Scanning for red flags in potential matches. Checking for: conflicting sleep schedules (early bird vs night owl), cleanliness mismatches (very organized vs relaxed), noise tolerance gaps, incompatible study habits, and dietary restrictions. Flagging any severe incompatibilities for user attention.`
        },
        {
          agent: 'Wingman Advisor',
          message: 'Generating relationship advice...',
          reasoning: `Analyzing top matches for relationship dynamics. Providing ice-breaker suggestions based on shared interests, conversation starters about common preferences, and advice for first meeting arrangements. Considering Pakistani cultural context for appropriate meeting suggestions.`
        },
        {
          agent: 'Room Hunter',
          message: 'Finding suitable accommodations...',
          reasoning: `Searching for available rooms in ${data.area} and nearby areas within ${data.budget_min}-${data.budget_max} PKR budget. Cross-referencing with housing database, checking availability, proximity to universities/workplaces, and matching with roommate preferences for shared living spaces.`
        }
      ]
      
      for (let i = 0; i < agentSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setAgentProgress(prev => [...prev, {
          agent: agentSteps[i].agent,
          status: 'completed',
          message: agentSteps[i].message,
          reasoning: agentSteps[i].reasoning
        }])
      }

      setMatches(result.matches || [])
      setDetailedAgentReasoning(result.detailed_agent_reasoning || [])
      setAgentSummary(result.agent_summary || null)
      setCurrentStep(4)
      toast.success('Matches found successfully!')
      
    } catch (error) {
      console.error('Error finding matches:', error)
      toast.error('Failed to find matches. Please try again.')
      setCurrentStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    reset()
    setCurrentStep(1)
    setMatches([])
    setAgentProgress([])
    setDetailedAgentReasoning([])
    setAgentSummary(null)
    setShowDetailedReasoning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">Find Your Roommate</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Personal Info</span>
            <span>Preferences</span>
            <span>AI Analysis</span>
            <span>Matches</span>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">Let&apos;s start with your basic information</p>
            </div>

            <form onSubmit={handleSubmit(() => setCurrentStep(2))} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    City
                  </label>
                  <select
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select City</option>
                    {pakistaniCities.map(city => (
                      <option key={city} value={city} className="text-gray-900 bg-white">{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Neighborhood
                  </label>
                  <input
                    {...register('area', { required: 'Area is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Gulshan-e-Iqbal, DHA"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget Range (PKR per month)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('budget_min', { 
                        required: 'Minimum budget is required',
                        valueAsNumber: true,
                        min: { value: 1000, message: 'Budget must be at least 1000 PKR' }
                      })}
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Minimum"
                    />
                    {errors.budget_min && <p className="text-red-500 text-sm mt-1">{errors.budget_min.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register('budget_max', { 
                        required: 'Maximum budget is required',
                        valueAsNumber: true,
                        min: { value: 1000, message: 'Budget must be at least 1000 PKR' }
                      })}
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Maximum"
                    />
                    {errors.budget_max && <p className="text-red-500 text-sm mt-1">{errors.budget_max.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Preferences */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Lifestyle Preferences</h2>
              <p className="text-gray-600">Help us find the most compatible roommates for you</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Sleep Schedule
                  </label>
                  <select
                    {...register('sleep_schedule', { required: 'Sleep schedule is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Schedule</option>
                    <option value="Early bird" className="text-gray-900 bg-white">Early bird (sleep before 11 PM)</option>
                    <option value="Night owl" className="text-gray-900 bg-white">Night owl (sleep after 1 AM)</option>
                    <option value="Normal" className="text-gray-900 bg-white">Normal (11 PM - 1 AM)</option>
                    <option value="Flexible" className="text-gray-900 bg-white">Flexible</option>
                  </select>
                  {errors.sleep_schedule && <p className="text-red-500 text-sm mt-1">{errors.sleep_schedule.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    Cleanliness Level
                  </label>
                  <select
                    {...register('cleanliness', { required: 'Cleanliness preference is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Level</option>
                    <option value="Very organized" className="text-gray-900 bg-white">Very organized</option>
                    <option value="Moderately clean" className="text-gray-900 bg-white">Moderately clean</option>
                    <option value="Relaxed" className="text-gray-900 bg-white">Relaxed about cleanliness</option>
                    <option value="Flexible" className="text-gray-900 bg-white">Flexible</option>
                  </select>
                  {errors.cleanliness && <p className="text-red-500 text-sm mt-1">{errors.cleanliness.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Noise Tolerance
                  </label>
                  <select
                    {...register('noise_tolerance', { required: 'Noise tolerance is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Tolerance</option>
                    <option value="Prefer quiet" className="text-gray-900 bg-white">Prefer quiet environment</option>
                    <option value="Moderate noise ok" className="text-gray-900 bg-white">Moderate noise is okay</option>
                    <option value="High tolerance" className="text-gray-900 bg-white">High noise tolerance</option>
                    <option value="Flexible" className="text-gray-900 bg-white">Flexible</option>
                  </select>
                  {errors.noise_tolerance && <p className="text-red-500 text-sm mt-1">{errors.noise_tolerance.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Habits
                  </label>
                  <select
                    {...register('study_habits', { required: 'Study habits are required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Habits</option>
                    <option value="Intensive studier" className="text-gray-900 bg-white">Intensive studier</option>
                    <option value="Regular study schedule" className="text-gray-900 bg-white">Regular study schedule</option>
                    <option value="Casual learner" className="text-gray-900 bg-white">Casual learner</option>
                    <option value="Group study preferred" className="text-gray-900 bg-white">Group study preferred</option>
                  </select>
                  {errors.study_habits && <p className="text-red-500 text-sm mt-1">{errors.study_habits.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Preferences
                </label>
                <select
                  {...register('food_pref', { required: 'Food preference is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="" className="text-gray-500 bg-white">Select Preference</option>
                  <option value="Pakistani/Desi food" className="text-gray-900 bg-white">Pakistani/Desi food</option>
                  <option value="Vegetarian" className="text-gray-900 bg-white">Vegetarian</option>
                  <option value="Mixed cuisine" className="text-gray-900 bg-white">Mixed cuisine</option>
                  <option value="Fast food" className="text-gray-900 bg-white">Fast food</option>
                  <option value="Home cooking" className="text-gray-900 bg-white">Home cooking</option>
                  <option value="Flexible" className="text-gray-900 bg-white">Flexible</option>
                </select>
                {errors.food_pref && <p className="text-red-500 text-sm mt-1">{errors.food_pref.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Preferences (Optional)
                </label>
                <textarea
                  {...register('additional_preferences')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any other preferences, hobbies, or requirements you'd like to mention..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Finding Matches...' : 'Find My Matches'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: AI Analysis */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis in Progress</h2>
              <p className="text-gray-600">Our intelligent agents are finding your perfect matches</p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {agentProgress.map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-gray-900">{agent.agent}</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complete</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{agent.message}</p>
                      {agent.reasoning && (
                        <div className="bg-white/70 p-3 rounded border-l-2 border-blue-300">
                          <p className="text-xs text-gray-600 font-medium mb-1">💭 Agent Reasoning:</p>
                          <p className="text-xs text-gray-800 leading-relaxed">{agent.reasoning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {agentProgress.length < 5 && (
                <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Processing...</p>
                    <p className="text-sm text-gray-600">Analyzing compatibility factors</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4: Matches */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Matches</h2>
                  <p className="text-gray-600">Found {matches.length} compatible roommates</p>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-secondary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
                >
                  New Search
                </button>
              </div>

              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your preferences or expanding your search criteria</p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Adjust Preferences
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {matches.map((match, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {match.match_name || `Match #${index + 1}`}
                          </h3>
                          {match.match_id && (
                            <p className="text-sm text-primary-600 font-medium mb-1">Profile ID: {match.match_id}</p>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{match.location || 'Location not specified'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="font-semibold text-gray-900">
                            {match.compatibility_score || 'N/A'}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Profile:</p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {match.profile_summary || match.description || 'No description available'}
                          </p>
                        </div>
                        
                        {match.compatibility_analysis && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Compatibility Analysis:</p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {match.compatibility_analysis}
                            </p>
                          </div>
                        )}
                        
                        {match.red_flags && match.red_flags.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-red-700 mb-1">Considerations:</p>
                            <ul className="text-red-600 text-sm space-y-1">
                              {match.red_flags.map((flag: string, flagIndex: number) => (
                                <li key={flagIndex}>• {flag}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {match.wingman_advice && (
                          <div>
                            <p className="text-sm font-medium text-primary-700 mb-1">Wingman Advice:</p>
                            <p className="text-primary-600 text-sm leading-relaxed">
                              {match.wingman_advice}
                            </p>
                          </div>
                        )}
                        
                        {match.reasoning_details && (
                          <div>
                            <p className="text-sm font-medium text-indigo-700 mb-2">🧠 Compatibility Breakdown:</p>
                            <div className="bg-indigo-50 p-3 rounded-lg space-y-1">
                              {Object.entries(match.reasoning_details).map(([key, value], idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className="text-indigo-700 font-medium capitalize">
                                    {key.replace('_', ' ')}
                                  </span>
                                  <span className="text-indigo-600">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            const message = `Hi! I'm interested in connecting with ${match.profile_id} through RoomMate Matcher. Here are the details:%0A%0AProfile: ${match.profile_id}%0ALocation: ${match.location || 'N/A'}%0ACompatibility: ${match.compatibility_score}%0A%0APlease help me connect!`;
                            window.open(`https://wa.me/923193608483?text=${message}`, '_blank');
                          }}
                          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                          </svg>
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Detailed Agent Reasoning Section */}
              {detailedAgentReasoning.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Detailed Agent Analysis
                    </h3>
                    <button
                      onClick={() => setShowDetailedReasoning(!showDetailedReasoning)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {showDetailedReasoning ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  
                  {agentSummary && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-900 mb-2">📊 Processing Summary</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Agents Involved:</span>
                          <span className="text-blue-600 ml-1">{agentSummary.total_agents_involved}</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Processing Time:</span>
                          <span className="text-blue-600 ml-1">
                            {new Date(agentSummary.processing_time).toLocaleTimeString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Agent Flow:</span>
                          <span className="text-blue-600 ml-1">
                            {agentSummary.agent_flow?.join(' → ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showDetailedReasoning && (
                    <div className="space-y-4">
                      {detailedAgentReasoning.map((reasoning, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {reasoning.step_number}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 capitalize">
                                  {reasoning.agent_name.replace('_', ' ')}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  {reasoning.agent_type} • {new Date(reasoning.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                              {reasoning.reasoning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

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