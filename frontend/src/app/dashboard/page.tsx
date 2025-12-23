'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, CreditCard, Star, Phone, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { bookingsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const getStatusBadge = (status: string) => {
  const badges = {
    CONFIRMED: 'badge-info',
    IN_PROGRESS: 'badge-warning',
    COMPLETED: 'badge-success',
    CANCELLED: 'badge-danger',
    NO_SHOW: 'badge-danger'
  }
  return badges[status as keyof typeof badges] || 'badge-info'
}

const getStatusText = (status: string) => {
  const texts = {
    CONFIRMED: 'Confirmed',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show'
  }
  return texts[status as keyof typeof texts] || status
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('upcoming')

  const { data: bookingsData, isLoading, error, refetch } = useQuery(
    'my-bookings',
    bookingsAPI.getMyBookings,
    {
      retry: 1,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      onError: (err) => console.error('Bookings error:', err)
    }
  )

  const bookings = bookingsData?.data.bookings || []
  
  const upcomingBookings = bookings.filter((booking: any) => 
    ['CONFIRMED', 'IN_PROGRESS'].includes(booking.status) &&
    new Date(booking.bookingDate) >= new Date()
  )
  
  const pastBookings = bookings.filter((booking: any) => 
    ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(booking.status) ||
    new Date(booking.bookingDate) < new Date()
  )

  const stats = {
    totalBookings: bookings.length,
    upcomingBookings: upcomingBookings.length,
    completedBookings: bookings.filter((b: any) => b.status === 'COMPLETED').length,
    totalSpent: bookings
      .filter((b: any) => b.status === 'COMPLETED')
      .reduce((sum: number, b: any) => sum + b.totalAmount, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white via-luxury-beige to-luxury-white">
      <Header />
      
      <div className="pt-28 pb-20">
        <div className="container-max section-padding">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-3">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-xl text-luxury-gray-600">
              Manage your appointments and profile from your personal dashboard
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Total Bookings',
                value: stats.totalBookings,
                icon: <Calendar className="w-8 h-8" />,
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Upcoming',
                value: stats.upcomingBookings,
                icon: <Clock className="w-8 h-8" />,
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                title: 'Completed',
                value: stats.completedBookings,
                icon: <Star className="w-8 h-8" />,
                gradient: 'from-green-500 to-green-600'
              },
              {
                title: 'Total Spent',
                value: `₹${stats.totalSpent.toLocaleString()}`,
                icon: <CreditCard className="w-8 h-8" />,
                gradient: 'from-luxury-gold to-amber-600'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative card bg-luxury-white/80 backdrop-blur-sm border-2 border-luxury-gold/10 group-hover:border-luxury-gold/30 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-luxury-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-luxury-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Bookings Section */}
            <div className="lg:col-span-2">
              <div className="card bg-luxury-white/80 backdrop-blur-sm border-2 border-luxury-gold/10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-luxury-black">My Appointments</h2>
                  <Link href="/book-appointment" className="px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Book New
                  </Link>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8 bg-luxury-beige/50 rounded-xl p-1.5">
                  {[
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'past', label: 'Past' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black shadow-lg'
                          : 'text-luxury-gray-600 hover:text-luxury-black hover:bg-luxury-white/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
                      <p className="text-luxury-gray-600 mt-2">Loading appointments...</p>
                    </div>
                  ) : (
                    <>
                      {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-luxury-gray-400 mx-auto mb-4" />
                          <p className="text-luxury-gray-600">
                            {activeTab === 'upcoming' 
                              ? 'No upcoming appointments' 
                              : 'No past appointments'}
                          </p>
                        </div>
                      ) : (
                        (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking: any) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border border-luxury-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-luxury-black">
                                  {format(new Date(booking.bookingDate), 'EEEE, MMMM d, yyyy')}
                                </h3>
                                <p className="text-luxury-gray-600 text-sm">
                                  {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                                </p>
                              </div>
                              <span className={`badge ${getStatusBadge(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm text-luxury-gray-600 mb-1">Services:</p>
                              <div className="flex flex-wrap gap-2">
                                {booking.serviceNames?.map((name: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-luxury-beige text-luxury-black text-xs px-2 py-1 rounded"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-luxury-gray-600">
                                  Staff: {booking.staff?.user?.firstName} {booking.staff?.user?.lastName}
                                </p>
                                <p className="font-semibold text-luxury-gold">
                                  ₹{booking.totalAmount}
                                </p>
                              </div>
                              
                              {booking.status === 'CONFIRMED' && (
                                <div className="flex space-x-2">
                                  <button className="text-luxury-gray-600 hover:text-luxury-black text-sm">
                                    Reschedule
                                  </button>
                                  <button className="text-red-600 hover:text-red-700 text-sm">
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card bg-luxury-white/80 backdrop-blur-sm border-2 border-luxury-gold/10">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/book-appointment" className="block px-6 py-4 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all text-center">
                    <Calendar className="w-5 h-5 mr-2 inline" />
                    Book Appointment
                  </Link>
                  <Link href="/profile" className="block px-6 py-4 border-2 border-luxury-gold/30 text-luxury-black rounded-lg font-semibold hover:bg-luxury-gold/10 transition-all text-center">
                    <User className="w-5 h-5 mr-2 inline" />
                    Edit Profile
                  </Link>
                  <Link href="/services" className="block px-6 py-4 bg-luxury-beige/50 text-luxury-black rounded-lg font-semibold hover:bg-luxury-beige transition-all text-center">
                    View Services
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card bg-luxury-white/80 backdrop-blur-sm border-2 border-luxury-gold/10">
                <h3 className="text-xl font-bold mb-6">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <span className="font-medium">+91 98765 43210</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <span className="font-medium">123 Beauty Street, Fashion District, City 110001</span>
                  </div>
                </div>
              </div>

              {/* Loyalty Points */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold via-amber-500 to-yellow-600" />
                <div className="relative card border-0 text-luxury-black">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Loyalty Points</h3>
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <p className="text-4xl font-bold mb-2">1,250</p>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Earn points with every visit and redeem for discounts!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}