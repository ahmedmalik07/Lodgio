'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Home, User, MapPin, DollarSign, Wifi, Car, Utensils, Plus, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth, EmailAuthModal } from '../../components/EmailAuth'

interface ProviderFormData {
  name: string
  contact_number: string
  city: string
  area: string
  property_type: string
  monthly_rent: number
  rooms_available: number
  total_rooms: number
  furnished: string
  utilities_included: boolean
  wifi_included: boolean
  parking_available: boolean
  kitchen_access: string
  laundry_facilities: boolean
  security_features: string[]
  nearby_facilities: string[]
  house_rules: string
  additional_info: string
  preferred_tenant_type: string
  gender_preference: string
}

const pakistaniCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
]

const commonAmenities = [
  'Security Guard', 'CCTV', 'Generator', 'Water Tank', 
  'Garden', 'Terrace', 'Gym', 'Rooftop', 'Elevator', 'Air Conditioning'
]

const nearbyFacilities = [
  'University', 'Hospital', 'Shopping Mall', 'Mosque', 'Market',
  'Bus Stop', 'Metro Station', 'Bank', 'Pharmacy', 'Gym'
]

export default function ProviderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { user, loading } = useAuth()
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ProviderFormData>()
  
  // Check authentication - show modal if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [user, loading])

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [user, loading])

  // Show authentication modal if not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <Home className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">You need to sign in to list your property on RoomMate Matcher.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors font-medium w-full"
          >
            Sign In to Continue
          </button>
          <Link href="/" className="block mt-4 text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
        <EmailAuthModal 
          isOpen={showAuthModal} 
          onCloseAction={() => setShowAuthModal(false)} 
        />
      </div>
    )
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    )
  }

  const onSubmit = async (data: ProviderFormData) => {
    setIsLoading(true)
    
    try {
      // Prepare the listing data
      const listingData = {
        ...data,
        security_features: selectedAmenities,
        nearby_facilities: selectedFacilities,
        listing_id: `PROP-${Date.now()}`,
        availability: 'Available',
        amenities: selectedAmenities.join(', ')
      }

      // Send to backend API
      const response = await fetch('http://localhost:8000/list-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('API Response:', result)
      
      setIsSubmitted(true)
      toast.success('Property listed successfully with AI analysis!')
      
    } catch (error) {
      console.error('Error submitting listing:', error)
      toast.error('Failed to list property. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    reset()
    setCurrentStep(1)
    setSelectedAmenities([])
    setSelectedFacilities([])
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center"
        >
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Listed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your property has been added to our database and will be visible to potential roommates.
          </p>
          <div className="space-y-3">
            <button
              onClick={resetForm}
              className="w-full bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
            >
              List Another Property
            </button>
            <Link href="/" className="block w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-700 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-secondary-600" />
                <h1 className="text-xl font-bold text-gray-900">List Your Property</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step 
                    ? 'bg-secondary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-2 ${
                    currentStep > step ? 'bg-secondary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Property Details</span>
            <span>Amenities & Features</span>
            <span>Rules & Preferences</span>
          </div>
        </div>

        {/* Step 1: Property Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Information</h2>
              <p className="text-gray-600">Tell us about your property and contact details</p>
            </div>

            <form onSubmit={handleSubmit(() => setCurrentStep(2))} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Your Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    {...register('contact_number', { required: 'Contact number is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="+92 300 1234567"
                  />
                  {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    City
                  </label>
                  <select
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="e.g., Gulshan-e-Iqbal, DHA"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    {...register('property_type', { required: 'Property type is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Type</option>
                    <option value="Apartment" className="text-gray-900 bg-white">Apartment</option>
                    <option value="House" className="text-gray-900 bg-white">House</option>
                    <option value="Shared Room" className="text-gray-900 bg-white">Shared Room</option>
                    <option value="Private Room" className="text-gray-900 bg-white">Private Room</option>
                    <option value="Studio" className="text-gray-900 bg-white">Studio</option>
                    <option value="Portion" className="text-gray-900 bg-white">Portion</option>
                  </select>
                  {errors.property_type && <p className="text-red-500 text-sm mt-1">{errors.property_type.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Monthly Rent (PKR)
                  </label>
                  <input
                    {...register('monthly_rent', { 
                      required: 'Monthly rent is required',
                      valueAsNumber: true,
                      min: { value: 1000, message: 'Rent must be at least 1000 PKR' }
                    })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="25000"
                  />
                  {errors.monthly_rent && <p className="text-red-500 text-sm mt-1">{errors.monthly_rent.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rooms Available for Rent
                  </label>
                  <input
                    {...register('rooms_available', { 
                      required: 'Number of rooms available is required',
                      valueAsNumber: true,
                      min: { value: 1, message: 'At least 1 room must be available' }
                    })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="2"
                  />
                  {errors.rooms_available && <p className="text-red-500 text-sm mt-1">{errors.rooms_available.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms in Property
                  </label>
                  <input
                    {...register('total_rooms', { 
                      required: 'Total rooms is required',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Total rooms must be at least 1' }
                    })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="3"
                  />
                  {errors.total_rooms && <p className="text-red-500 text-sm mt-1">{errors.total_rooms.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnished Status
                </label>
                <select
                  {...register('furnished', { required: 'Furnished status is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="" className="text-gray-500 bg-white">Select Status</option>
                  <option value="Fully Furnished" className="text-gray-900 bg-white">Fully Furnished</option>
                  <option value="Semi Furnished" className="text-gray-900 bg-white">Semi Furnished</option>
                  <option value="Unfurnished" className="text-gray-900 bg-white">Unfurnished</option>
                </select>
                {errors.furnished && <p className="text-red-500 text-sm mt-1">{errors.furnished.message}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Amenities & Features */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Amenities & Features</h2>
              <p className="text-gray-600">What facilities and services do you provide?</p>
            </div>

            <form onSubmit={handleSubmit(() => setCurrentStep(3))} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      {...register('utilities_included')}
                      type="checkbox"
                      className="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Utilities Included (Gas, Electricity, Water)
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      {...register('wifi_included')}
                      type="checkbox"
                      className="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                    />
                    <Wifi className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">
                      WiFi/Internet Included
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      {...register('parking_available')}
                      type="checkbox"
                      className="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                    />
                    <Car className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">
                      Parking Available
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      {...register('laundry_facilities')}
                      type="checkbox"
                      className="w-4 h-4 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Laundry Facilities
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Utensils className="inline h-4 w-4 mr-1" />
                    Kitchen Access
                  </label>
                  <select
                    {...register('kitchen_access', { required: 'Kitchen access info is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Access Type</option>
                    <option value="Full kitchen access" className="text-gray-900 bg-white">Full kitchen access</option>
                    <option value="Shared kitchen" className="text-gray-900 bg-white">Shared kitchen</option>
                    <option value="Limited kitchen access" className="text-gray-900 bg-white">Limited kitchen access</option>
                    <option value="No kitchen access" className="text-gray-900 bg-white">No kitchen access</option>
                  </select>
                  {errors.kitchen_access && <p className="text-red-500 text-sm mt-1">{errors.kitchen_access.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Amenities (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAmenities.map((amenity) => (
                    <div
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedAmenities.includes(amenity)
                          ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                          : 'border-gray-300 hover:border-secondary-300 bg-white text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{amenity}</span>
                        {selectedAmenities.includes(amenity) ? (
                          <div className="w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <Plus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nearby Facilities (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nearbyFacilities.map((facility) => (
                    <div
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedFacilities.includes(facility)
                          ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                          : 'border-gray-300 hover:border-secondary-300 bg-white text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{facility}</span>
                        {selectedFacilities.includes(facility) ? (
                          <div className="w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <Plus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  className="bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Rules & Preferences */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rules & Tenant Preferences</h2>
              <p className="text-gray-600">Set your house rules and preferred tenant type</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Tenant Type
                  </label>
                  <select
                    {...register('preferred_tenant_type', { required: 'Tenant type preference is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Preference</option>
                    <option value="Students" className="text-gray-900 bg-white">Students</option>
                    <option value="Working Professionals" className="text-gray-900 bg-white">Working Professionals</option>
                    <option value="Families" className="text-gray-900 bg-white">Families</option>
                    <option value="Any" className="text-gray-900 bg-white">Any</option>
                  </select>
                  {errors.preferred_tenant_type && <p className="text-red-500 text-sm mt-1">{errors.preferred_tenant_type.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Preference
                  </label>
                  <select
                    {...register('gender_preference', { required: 'Gender preference is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500 bg-white">Select Preference</option>
                    <option value="Male only" className="text-gray-900 bg-white">Male only</option>
                    <option value="Female only" className="text-gray-900 bg-white">Female only</option>
                    <option value="No preference" className="text-gray-900 bg-white">No preference</option>
                  </select>
                  {errors.gender_preference && <p className="text-red-500 text-sm mt-1">{errors.gender_preference.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Rules
                </label>
                <textarea
                  {...register('house_rules')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="e.g., No smoking, No pets, Quiet hours after 10 PM, No guests after midnight..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  {...register('additional_info')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="Any other details about the property, neighborhood, or specific requirements..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Review Your Listing</h4>
                <p className="text-sm text-gray-600">
                  Make sure all information is accurate before submitting. Once submitted, your property will be visible to potential tenants.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Listing Property...' : 'List My Property'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
      
      {/* Authentication Modal */}
      <EmailAuthModal 
        isOpen={showAuthModal} 
        onCloseAction={() => setShowAuthModal(false)} 
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                  <Home className="h-5 w-5 text-white" />
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