'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { Calendar, Clock, User, CreditCard } from 'lucide-react'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { servicesAPI, staffAPI, bookingsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface BookingStep {
  id: number
  title: string
  icon: React.ReactNode
}

const steps: BookingStep[] = [
  { id: 1, title: 'Select Services', icon: <User className="w-5 h-5" /> },
  { id: 2, title: 'Choose Staff & Time', icon: <Clock className="w-5 h-5" /> },
  { id: 3, title: 'Confirm Details', icon: <Calendar className="w-5 h-5" /> },
  { id: 4, title: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
]

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  
  const { user, isAuthenticated } = useAuthStore()

  // Fetch services
  const { data: servicesData } = useQuery('services', servicesAPI.getAll)
  
  // Auto-select service from URL parameter
  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (serviceId && servicesData?.data.services) {
      setSelectedServices([serviceId])
    }
  }, [searchParams, servicesData])
  
  // Fetch staff
  const { data: staffData } = useQuery('staff', staffAPI.getAll)
  
  // Fetch availability when services, staff, and date are selected
  const { data: availabilityData } = useQuery(
    ['availability', selectedServices, selectedStaff, selectedDate],
    () => bookingsAPI.getAvailability({
      serviceIds: selectedServices.join(','),
      staffId: selectedStaff,
      date: selectedDate
    }),
    {
      enabled: !!(selectedServices.length > 0 && selectedStaff && selectedDate),
    }
  )

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const calculateTotal = () => {
    if (!servicesData?.data.services) return 0
    
    return Object.values(servicesData.data.services)
      .flat()
      .filter((service: any) => selectedServices.includes(service.id))
      .reduce((total: number, service: any) => total + service.price, 0)
  }

  const getFilteredServices = () => {
    if (!servicesData?.data.services) return {}
    
    let filtered: any = {}
    
    Object.entries(servicesData.data.services).forEach(([category, services]) => {
      if (selectedCategory !== 'ALL' && category !== selectedCategory) return
      
      const matchedServices = (services as any[]).filter((service: any) => {
        const searchLower = searchQuery.toLowerCase()
        return service.name.toLowerCase().includes(searchLower) ||
               service.description?.toLowerCase().includes(searchLower)
      })
      
      if (matchedServices.length > 0) {
        filtered[category] = matchedServices
      }
    })
    
    return filtered
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment')
      return
    }

    try {
      const bookingData = {
        staffId: selectedStaff,
        serviceIds: selectedServices,
        bookingDate: selectedDate,
        startTime: selectedTime,
        notes: bookingNotes,
        paymentMethod: 'COD'
      }

      console.log('Booking data:', bookingData)
      const response = await bookingsAPI.create(bookingData)
      console.log('Booking response:', response)
      toast.success('Appointment booked successfully!')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (error: any) {
      console.error('Booking error:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.'
      toast.error(errorMessage)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const filteredServices = getFilteredServices()
        const categories = servicesData?.data.services ? ['ALL', ...Object.keys(servicesData.data.services)] : ['ALL']
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold bg-clip-text text-transparent"
              >
                Choose Your Services
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-luxury-gray-600 max-w-2xl mx-auto"
              >
                Select from our premium collection of beauty and grooming services
              </motion.p>
            </div>

            {/* Search and Filter Bar */}
            <div className="sticky top-20 z-10 bg-gradient-to-r from-luxury-white via-amber-50/30 to-luxury-white backdrop-blur-xl p-6 -mx-8 -mt-8 mb-10 border-b-2 border-luxury-gold/30 shadow-2xl rounded-b-3xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search services by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-luxury-gray-200 rounded-2xl focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/20 focus:outline-none transition-all text-lg shadow-md hover:shadow-lg bg-white"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-luxury-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all text-sm shadow-md ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black shadow-xl shadow-luxury-gold/30 scale-105 ring-2 ring-luxury-gold/50'
                          : 'bg-white text-luxury-gray-700 hover:bg-gradient-to-r hover:from-luxury-gold/10 hover:to-amber-100 hover:scale-105 hover:shadow-lg border border-luxury-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedServices.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex items-center justify-between p-5 bg-gradient-to-r from-luxury-gold/20 via-amber-100/50 to-luxury-gold/20 rounded-2xl border-2 border-luxury-gold/40 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-luxury-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg font-semibold text-luxury-black">
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-luxury-gray-600 font-medium">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-luxury-gold to-amber-600 bg-clip-text text-transparent">₹{calculateTotal()}</span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {Object.keys(filteredServices).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-luxury-gray-500 text-lg">No services found</p>
              </div>
            ) : (
              Object.entries(filteredServices).map(([category, services]) => (
                <motion.div 
                  key={category} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-luxury-gold/50 to-luxury-gold"></div>
                    <div className="px-6 py-2 bg-gradient-to-r from-luxury-gold to-amber-600 rounded-full shadow-lg">
                      <h3 className="text-xl font-bold text-luxury-black uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-luxury-gold to-transparent via-luxury-gold/50"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(services as any[]).map((service: any, index: number) => (
                      <motion.button
                        type="button"
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 text-left ${
                          selectedServices.includes(service.id)
                            ? 'border-luxury-gold bg-gradient-to-br from-luxury-gold/20 via-amber-50 to-luxury-gold/10 shadow-2xl shadow-luxury-gold/20 scale-[1.02] ring-2 ring-luxury-gold/30'
                            : 'border-luxury-gray-200 bg-white hover:border-luxury-gold/60 hover:shadow-xl hover:shadow-luxury-gold/10 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white hover:to-amber-50/30'
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/0 via-transparent to-amber-500/0 group-hover:from-luxury-gold/5 group-hover:to-amber-500/5 transition-all duration-300"></div>
                        
                        <div className="relative p-8">
                          <div className="flex items-start gap-5 mb-6">
                            <div className={`mt-0.5 w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all shadow-md ${
                              selectedServices.includes(service.id)
                                ? 'bg-gradient-to-br from-luxury-gold to-amber-600 border-luxury-gold shadow-luxury-gold/50 scale-110'
                                : 'border-luxury-gray-300 bg-white group-hover:border-luxury-gold group-hover:bg-luxury-gold/10 group-hover:scale-110'
                            }`}>
                              {selectedServices.includes(service.id) && (
                                <motion.svg 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 text-white" 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </motion.svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-2xl text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors line-clamp-1">
                                {service.name}
                              </h4>
                            </div>
                          </div>
                          <p className="text-xl text-luxury-gray-600 line-clamp-2 mb-6 min-h-[4rem] leading-relaxed">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-luxury-gray-200/50">
                            <div className="flex items-center gap-2.5 px-3 py-2 bg-luxury-gray-50 rounded-xl group-hover:bg-luxury-gold/10 transition-colors">
                              <Clock className="w-6 h-6 text-luxury-gold" />
                              <span className="font-semibold text-lg text-luxury-gray-700">{service.duration}m</span>
                            </div>
                            <div className={`text-3xl font-bold transition-all ${
                              selectedServices.includes(service.id) 
                                ? 'bg-gradient-to-r from-luxury-gold to-amber-600 bg-clip-text text-transparent scale-110' 
                                : 'text-luxury-black group-hover:text-luxury-gold'
                            }`}>
                              ₹{service.price}
                            </div>
                          </div>
                        </div>
                        
                        {selectedServices.includes(service.id) && (
                          <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-luxury-gold to-amber-600 opacity-20 rounded-bl-full"
                          ></motion.div>
                        )}
                        
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-luxury-gold/10 to-amber-500/10 blur-xl"></div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Choose Staff & Time</h2>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Select Staff Member</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {staffData?.data.staff?.map((staff: any) => (
                  <button
                    type="button"
                    key={staff.id}
                    className={`card text-left cursor-pointer transition-all duration-200 pointer-events-auto hover:scale-[1.02] ${
                      selectedStaff === staff.id
                        ? 'ring-2 ring-luxury-gold bg-luxury-gold/10 shadow-lg'
                        : 'hover:shadow-lg hover:ring-1 hover:ring-luxury-gold/50'
                    }`}
                    onClick={() => {
                      console.log('Staff clicked:', staff.id);
                      setSelectedStaff(staff.id);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-luxury-beige rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-luxury-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">
                          {staff.user.firstName} {staff.user.lastName}
                        </h4>
                        <p className="text-luxury-gray-600 text-sm">
                          {staff.position}
                        </p>
                      </div>
                      {selectedStaff === staff.id && (
                        <div className="w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((date) => (
                  <button
                    type="button"
                    key={date.toISOString()}
                    className={`p-3 text-center rounded-lg border transition-all duration-200 pointer-events-auto ${
                      selectedDate === format(date, 'yyyy-MM-dd')
                        ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                        : 'border-luxury-gray-300 hover:border-luxury-gold'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(format(date, 'yyyy-MM-dd'));
                    }}
                  >
                    <div className="text-xs text-luxury-gray-500">
                      {format(date, 'EEE')}
                    </div>
                    <div className="font-semibold">
                      {format(date, 'd')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && selectedStaff && (
              <div>
                <h3 className="text-lg font-medium mb-4">Select Time</h3>
                <div className="grid grid-cols-4 gap-3">
                  {/* Generate time slots from 10 AM to 10 PM */}
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = Math.floor(10 + i * 0.5);
                    const minute = (i % 2) * 30;
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const dateTime = `${selectedDate}T${timeStr}:00`;
                    
                    return (
                      <button
                        type="button"
                        key={timeStr}
                        className={`p-3 text-center rounded-lg border transition-all duration-200 pointer-events-auto ${
                          selectedTime === dateTime
                            ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                            : 'border-luxury-gray-300 hover:border-luxury-gold hover:bg-luxury-gold/10'
                        }`}
                        onClick={() => {
                          console.log('Time selected:', dateTime);
                          setSelectedTime(dateTime);
                        }}
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Confirm Details</h2>
            
            <div className="card">
              <h3 className="font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-luxury-gray-600">Services:</p>
                  <ul className="list-disc list-inside">
                    {selectedServices.map(serviceId => {
                      const service: any = Object.values(servicesData?.data.services || {})
                        .flat()
                        .find((s: any) => s.id === serviceId)
                      return (
                        <li key={serviceId} className="font-medium">
                          {service?.name} - ₹{service?.price}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                
                <div>
                  <p className="text-luxury-gray-600">Staff:</p>
                  <p className="font-medium">
                    {staffData?.data.staff?.find((s: any) => s.id === selectedStaff)?.user.firstName}{' '}
                    {staffData?.data.staff?.find((s: any) => s.id === selectedStaff)?.user.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-luxury-gray-600">Date & Time:</p>
                  <p className="font-medium">
                    {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')} at{' '}
                    {selectedTime && format(new Date(selectedTime), 'HH:mm')}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total: ₹{calculateTotal()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="input-field h-24 resize-none"
                placeholder="Any special requests or notes..."
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Confirm Booking</h2>
            
            <div className="card">
              <h3 className="font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{Math.round(calculateTotal() * 0.18)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{Math.round(calculateTotal() * 1.18)}</span>
                </div>
              </div>
            </div>

            <div className="card bg-luxury-gold/10 border-2 border-luxury-gold/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-luxury-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Cash on Delivery (COD)</h3>
                  <p className="text-sm text-luxury-gray-600">Pay at the salon after service</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBooking}
                className="btn-primary w-full text-lg py-4"
              >
                Confirm Booking
              </button>
              <p className="text-center text-luxury-gray-600 text-sm">
                Payment will be collected at the salon
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-luxury-beige">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container-max section-padding">
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step.id
                      ? 'bg-luxury-gold border-luxury-gold text-luxury-black'
                      : 'border-luxury-gray-300 text-luxury-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-luxury-black' : 'text-luxury-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-luxury-gold' : 'bg-luxury-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-full mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-luxury-white rounded-xl p-8 shadow-lg"
            >
              {renderStepContent()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < 4 && (
                <button
                  onClick={() => {
                    if (currentStep === 1 && selectedServices.length === 0) {
                      toast.error('Please select at least one service')
                      return
                    }
                    if (currentStep === 2 && (!selectedStaff || !selectedDate || !selectedTime)) {
                      toast.error('Please select staff, date, and time')
                      return
                    }
                    setCurrentStep(Math.min(4, currentStep + 1))
                  }}
                  className="btn-primary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}