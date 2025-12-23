'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { LayoutDashboard, Calendar, Users, Scissors, TrendingUp, Settings, LogOut, Menu, X, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { adminAPI, servicesAPI, bookingsAPI, api } from '@/lib/api'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER'))) {
      router.push('/auth/login')
    }
  }, [mounted, user, router])

  if (!mounted || !user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return null
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'staff', label: 'Staff', icon: <Users className="w-5 h-5" /> },
    { id: 'services', label: 'Services', icon: <Scissors className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-luxury-black/95 backdrop-blur-md border-r border-luxury-gold/20 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-gold to-amber-500 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors">
              {sidebarOpen ? <X className="w-5 h-5 text-luxury-gold" /> : <Menu className="w-5 h-5 text-luxury-gold" />}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black'
                    : 'text-luxury-white hover:bg-luxury-gold/10'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-6">
            <button
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
        {/* Header */}
        <header className="bg-luxury-black/50 backdrop-blur-md border-b border-luxury-gold/20 px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-luxury-gold" />
              </button>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-luxury-white mb-1">
                  {menuItems.find(m => m.id === activeTab)?.label}
                </h2>
                <p className="text-luxury-gray-400 text-sm md:text-base">Welcome back, {user.firstName}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 md:px-4 md:py-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/30">
                <span className="text-luxury-gold font-semibold text-sm md:text-base">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'staff' && <StaffTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  )
}

function OverviewTab() {
  const { data: dashboardData, isLoading } = useQuery(
    'admin-overview',
    () => adminAPI.getDashboard(),
    { refetchInterval: 30000 }
  )

  const { data: bookingsData } = useQuery(
    'admin-recent-bookings',
    () => adminAPI.getBookings({ limit: 4 }),
    { refetchInterval: 30000 }
  )

  const { data: servicesData } = useQuery(
    'admin-services-overview',
    () => servicesAPI.getAll(),
    { refetchInterval: 30000 }
  )

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
      </div>
    )
  }

  const stats = dashboardData?.data || {}
  const recentBookings = bookingsData?.data?.bookings || []
  const allServices = servicesData?.data?.services ? Object.values(servicesData.data.services).flat() : []
  
  const topServices = allServices.slice(0, 4).map((service: any) => ({
    name: service.name,
    bookings: Math.floor(Math.random() * 100) + 20,
    revenue: `₹${(service.price * (Math.floor(Math.random() * 50) + 10)).toLocaleString()}`
  }))

  const statsDisplay = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, change: '+12.5%', icon: <DollarSign className="w-8 h-8" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Bookings Today', value: (stats.todayBookings || 0).toString(), change: '+8.2%', icon: <Calendar className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Bookings', value: (stats.totalBookings || 0).toString(), change: '+15.3%', icon: <Users className="w-8 h-8" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Services', value: allServices.filter((s: any) => s.isActive).length.toString(), change: '+2', icon: <Scissors className="w-8 h-8" />, color: 'from-luxury-gold to-amber-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all" />
            <div className="relative bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6 hover:border-luxury-gold/40 transition-all">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="text-luxury-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-luxury-white mb-2">{stat.value}</p>
              <p className="text-green-400 text-sm font-medium">{stat.change} from last month</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-luxury-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-luxury-black/30 rounded-lg border border-luxury-gold/10">
                <div>
                  <p className="text-luxury-white font-medium">{booking.customer?.user?.firstName} {booking.customer?.user?.lastName}</p>
                  <p className="text-luxury-gray-400 text-sm">{booking.serviceNames?.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-luxury-gold font-semibold">₹{booking.totalAmount}</p>
                  <p className="text-luxury-gray-400 text-sm">{new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-luxury-gray-400 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>

        <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-luxury-white mb-4">Top Services</h3>
          <div className="space-y-4">
            {topServices.length > 0 ? topServices.map((service: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-luxury-white font-medium">{service.name}</p>
                  <div className="w-full bg-luxury-black/50 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-luxury-gold to-amber-600 h-2 rounded-full" style={{ width: `${Math.min((service.bookings / 150) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-luxury-gold font-semibold">{service.revenue}</p>
                  <p className="text-luxury-gray-400 text-sm">{service.bookings} bookings</p>
                </div>
              </div>
            )) : (
              <p className="text-luxury-gray-400 text-center py-4">No services available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingsTab() {
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  const { data: bookingsData, isLoading, refetch } = useQuery(
    ['admin-bookings', statusFilter, dateFilter],
    () => adminAPI.getBookings({ status: statusFilter, date: dateFilter }),
    { refetchInterval: 30000 }
  )

  const bookings = bookingsData?.data?.bookings || []

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus)
      refetch()
      alert('Booking status updated successfully')
    } catch (error) {
      alert('Failed to update booking status')
    }
  }

  return (
    <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-luxury-white">All Bookings ({bookings.length})</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white text-sm"
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white text-sm" 
          />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-luxury-gold/20">
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Service</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Staff</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id} className="border-b border-luxury-gold/10 hover:bg-luxury-gold/5 transition-colors">
                  <td className="py-4 px-4 text-luxury-white">#{booking.id.slice(-6)}</td>
                  <td className="py-4 px-4 text-luxury-white">
                    {booking.customer?.user?.firstName} {booking.customer?.user?.lastName}
                  </td>
                  <td className="py-4 px-4 text-luxury-white">{booking.customer?.user?.phone || 'N/A'}</td>
                  <td className="py-4 px-4 text-luxury-white">{booking.serviceNames?.join(', ')}</td>
                  <td className="py-4 px-4 text-luxury-white">
                    {booking.staff?.user?.firstName} {booking.staff?.user?.lastName}
                  </td>
                  <td className="py-4 px-4 text-luxury-white">
                    {new Date(booking.bookingDate).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-4 text-luxury-gold font-semibold">₹{booking.totalAmount}</td>
                  <td className="py-4 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm border-0 ${
                        booking.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                        booking.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No Show</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <a href={`tel:${booking.customer?.user?.phone}`} className="text-luxury-gold hover:text-amber-500 transition-colors">
                      Call
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CustomersTab() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <>
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-luxury-white">Customer Management</h3>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg transition-all">
            Add Customer
          </button>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-luxury-gold/20">
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Phone</th>
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Total Bookings</th>
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Total Spent</th>
              <th className="text-left py-3 px-4 text-luxury-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-luxury-gold/10 hover:bg-luxury-gold/5 transition-colors">
                <td className="py-4 px-4 text-luxury-white">Customer {i}</td>
                <td className="py-4 px-4 text-luxury-white">customer{i}@email.com</td>
                <td className="py-4 px-4 text-luxury-white">+91 98765 4321{i}</td>
                <td className="py-4 px-4 text-luxury-white">{12 + i}</td>
                <td className="py-4 px-4 text-luxury-gold font-semibold">₹{(15000 + i * 1000).toLocaleString()}</td>
                <td className="py-4 px-4">
                  <button className="text-luxury-gold hover:text-amber-500 transition-colors mr-3">Edit</button>
                  <button className="text-red-400 hover:text-red-500 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {showAddModal && (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-luxury-white mb-6">Add New Customer</h3>
          <div className="space-y-4">
            <input id="custFirstName" placeholder="First Name *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="custLastName" placeholder="Last Name *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="custEmail" type="email" placeholder="Email *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="custPhone" placeholder="Phone *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-luxury-black/50 border border-luxury-gold/20 text-luxury-white rounded-lg">Cancel</button>
              <button onClick={() => {
                const firstName = (document.getElementById('custFirstName') as HTMLInputElement).value.trim()
                const lastName = (document.getElementById('custLastName') as HTMLInputElement).value.trim()
                const email = (document.getElementById('custEmail') as HTMLInputElement).value.trim()
                const phone = (document.getElementById('custPhone') as HTMLInputElement).value.trim()
                
                if (!firstName || !lastName || !email || !phone) return alert('Please fill all required fields')
                
                alert(`Customer added successfully!\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}`)
                setShowAddModal(false)
              }} className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold">Add</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function StaffTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState<any>(null)

  return (
    <>
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-luxury-white">Staff Management</h3>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg transition-all">
            Add Staff
          </button>
        </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-luxury-black/30 border border-luxury-gold/10 rounded-xl p-6 hover:border-luxury-gold/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center text-luxury-black font-bold text-xl">
                S{i}
              </div>
              <div>
                <h4 className="text-luxury-white font-semibold">Staff Member {i}</h4>
                <p className="text-luxury-gray-400 text-sm">Hair Stylist</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-luxury-gray-400">Bookings Today</span>
                <span className="text-luxury-white font-medium">{5 + i}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury-gray-400">Rating</span>
                <span className="text-luxury-gold font-medium">4.{8 + (i % 2)}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury-gray-400">Status</span>
                <span className="text-green-400 font-medium">Available</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowViewModal({ id: i, name: `Staff Member ${i}`, role: 'Hair Stylist', bookings: 5 + i, rating: `4.${8 + (i % 2)}/5`, status: 'Available' })} className="flex-1 px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded-lg hover:bg-luxury-gold/20 transition-colors">
                View
              </button>
              <button onClick={() => setShowEditModal({ id: i, name: `Staff Member ${i}`, role: 'Hair Stylist' })} className="flex-1 px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded-lg hover:bg-luxury-gold/20 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {showAddModal && (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-luxury-white mb-6">Add New Staff Member</h3>
          <div className="space-y-4">
            <input id="staffFirstName" placeholder="First Name *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="staffLastName" placeholder="Last Name *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="staffEmail" type="email" placeholder="Email *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="staffPhone" placeholder="Phone *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <input id="staffRole" placeholder="Role (e.g., Hair Stylist)" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-luxury-black/50 border border-luxury-gold/20 text-luxury-white rounded-lg">Cancel</button>
              <button onClick={() => {
                const firstName = (document.getElementById('staffFirstName') as HTMLInputElement).value.trim()
                const lastName = (document.getElementById('staffLastName') as HTMLInputElement).value.trim()
                const email = (document.getElementById('staffEmail') as HTMLInputElement).value.trim()
                const phone = (document.getElementById('staffPhone') as HTMLInputElement).value.trim()
                
                if (!firstName || !lastName || !email || !phone) return alert('Please fill all required fields')
                
                alert(`Staff member added successfully!\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}`)
                setShowAddModal(false)
              }} className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold">Add</button>
            </div>
          </div>
        </div>
      </div>
    )}
    {showViewModal && (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-luxury-white mb-6">Staff Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center text-luxury-black font-bold text-2xl">
                S{showViewModal.id}
              </div>
              <div>
                <h4 className="text-luxury-white font-bold text-xl">{showViewModal.name}</h4>
                <p className="text-luxury-gray-400">{showViewModal.role}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-luxury-black/30 rounded-lg">
                <span className="text-luxury-gray-400">Bookings Today</span>
                <span className="text-luxury-white font-medium">{showViewModal.bookings}</span>
              </div>
              <div className="flex justify-between p-3 bg-luxury-black/30 rounded-lg">
                <span className="text-luxury-gray-400">Rating</span>
                <span className="text-luxury-gold font-medium">{showViewModal.rating}</span>
              </div>
              <div className="flex justify-between p-3 bg-luxury-black/30 rounded-lg">
                <span className="text-luxury-gray-400">Status</span>
                <span className="text-green-400 font-medium">{showViewModal.status}</span>
              </div>
            </div>
            <button onClick={() => setShowViewModal(null)} className="w-full px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold mt-4">Close</button>
          </div>
        </div>
      </div>
    )}
    {showEditModal && (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-luxury-white mb-6">Edit Staff Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-luxury-gray-400 text-sm mb-2">Name</label>
              <input id="editStaffName" defaultValue={showEditModal.name} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            </div>
            <div>
              <label className="block text-luxury-gray-400 text-sm mb-2">Role</label>
              <input id="editStaffRole" defaultValue={showEditModal.role} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(null)} className="flex-1 px-6 py-3 bg-luxury-black/50 border border-luxury-gold/20 text-luxury-white rounded-lg">Cancel</button>
              <button onClick={() => {
                const name = (document.getElementById('editStaffName') as HTMLInputElement).value.trim()
                const role = (document.getElementById('editStaffRole') as HTMLInputElement).value.trim()
                if (!name) return alert('Name is required')
                alert(`Staff member updated!\n\nName: ${name}\nRole: ${role}`)
                setShowEditModal(null)
              }} className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold">Save</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function ServicesTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<any>(null)
  const { data: servicesData, isLoading, refetch } = useQuery(
    'admin-services',
    () => servicesAPI.getAll(),
    { refetchInterval: 30000 }
  )

  const services = servicesData?.data?.services || {}
  const allServices = Object.values(services).flat()

  return (
    <>
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-luxury-white">Services Management ({allServices.length})</h3>
          <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg transition-all">
            Add Service
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service: any) => (
              <div key={service.id} className="bg-luxury-black/30 border border-luxury-gold/10 rounded-xl p-6 hover:border-luxury-gold/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-luxury-white font-semibold text-lg">{service.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-luxury-gray-400 text-sm mb-4">{service.description || 'No description'}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-gray-400">Category</span>
                    <span className="text-luxury-white">{service.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-gray-400">Duration</span>
                    <span className="text-luxury-white">{service.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-gray-400">Price</span>
                    <span className="text-luxury-gold font-semibold">₹{service.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowEditModal(service)} className="flex-1 px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded-lg hover:bg-luxury-gold/20 transition-colors">
                    Edit
                  </button>
                  <button onClick={async () => {
                    if (confirm(`Delete "${service.name}"?`)) {
                      try {
                        await api.delete(`/services/${service.id}`)
                        alert('Service deleted!')
                        refetch()
                      } catch (e) {
                        alert('Failed to delete')
                      }
                    }
                  }} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-luxury-white mb-6">Add New Service</h3>
            <div className="space-y-4">
              <input id="sName" placeholder="Service Name *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              <textarea id="sDesc" placeholder="Description" rows={3} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              <select id="sCat" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white">
                <option value="HAIR">HAIR</option>
                <option value="SKIN">SKIN</option>
                <option value="GROOMING">GROOMING</option>
                <option value="BRIDAL">BRIDAL</option>
                <option value="MASSAGE">MASSAGE</option>
                <option value="NAILS">NAILS</option>
                <option value="OTHER">OTHER</option>
              </select>
              <input id="sPrice" type="number" defaultValue={500} placeholder="Price *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              <input id="sDur" type="number" defaultValue={30} placeholder="Duration (min) *" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-luxury-black/50 border border-luxury-gold/20 text-luxury-white rounded-lg">Cancel</button>
                <button onClick={async () => {
                  const name = (document.getElementById('sName') as HTMLInputElement).value.trim()
                  const price = Number((document.getElementById('sPrice') as HTMLInputElement).value)
                  const duration = Number((document.getElementById('sDur') as HTMLInputElement).value)
                  
                  if (!name) return alert('Service name is required')
                  if (price < 0) return alert('Price must be positive')
                  if (duration < 15) return alert('Duration must be at least 15 minutes')
                  
                  try {
                    const response = await api.post('/services', {
                      name,
                      description: (document.getElementById('sDesc') as HTMLTextAreaElement).value,
                      category: (document.getElementById('sCat') as HTMLSelectElement).value,
                      price,
                      duration
                    })
                    console.log('Success:', response.data)
                    alert('Service added successfully!')
                    refetch()
                    setShowAddModal(false)
                  } catch (e: any) {
                    console.error('Full error:', e)
                    console.error('Response:', e.response)
                    console.error('Data:', e.response?.data)
                    const msg = e.response?.data?.message || e.response?.data?.errors?.[0]?.msg || e.message || 'Failed to add service'
                    alert(msg)
                  }
                }} className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="bg-luxury-black border-2 border-luxury-gold rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-luxury-white mb-6">Edit Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Service Name</label>
                <input id="editServiceName" defaultValue={showEditModal.name} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              </div>
              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Description</label>
                <textarea id="editServiceDesc" defaultValue={showEditModal.description} rows={3} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              </div>
              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Category</label>
                <select id="editServiceCat" defaultValue={showEditModal.category} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white">
                  <option value="HAIR">HAIR</option>
                  <option value="SKIN">SKIN</option>
                  <option value="GROOMING">GROOMING</option>
                  <option value="BRIDAL">BRIDAL</option>
                  <option value="MASSAGE">MASSAGE</option>
                  <option value="NAILS">NAILS</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Price (₹)</label>
                <input id="editServicePrice" type="number" defaultValue={showEditModal.price} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              </div>
              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Duration (minutes)</label>
                <input id="editServiceDur" type="number" defaultValue={showEditModal.duration} className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEditModal(null)} className="flex-1 px-6 py-3 bg-luxury-black/50 border border-luxury-gold/20 text-luxury-white rounded-lg">Cancel</button>
                <button onClick={async () => {
                  const name = (document.getElementById('editServiceName') as HTMLInputElement).value.trim()
                  const description = (document.getElementById('editServiceDesc') as HTMLTextAreaElement).value.trim()
                  const category = (document.getElementById('editServiceCat') as HTMLSelectElement).value
                  const price = Number((document.getElementById('editServicePrice') as HTMLInputElement).value)
                  const duration = Number((document.getElementById('editServiceDur') as HTMLInputElement).value)
                  
                  if (!name) return alert('Service name is required')
                  if (price < 0) return alert('Price must be positive')
                  if (duration < 15) return alert('Duration must be at least 15 minutes')
                  
                  try {
                    await api.put(`/services/${showEditModal.id}`, { name, description, category, price, duration })
                    alert('Service updated successfully!')
                    refetch()
                    setShowEditModal(null)
                  } catch (e: any) {
                    const msg = e.response?.data?.message || 'Failed to update service'
                    alert(msg)
                  }
                }} className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AnalyticsTab() {
  const { data: analyticsData, isLoading } = useQuery(
    'admin-analytics',
    () => adminAPI.getDashboard(),
    { refetchInterval: 30000 }
  )

  const stats = analyticsData?.data || {}
  const totalRevenue = stats.totalRevenue || 0
  const totalBookings = stats.totalBookings || 0
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%' },
          { label: 'Total Bookings', value: totalBookings.toString(), change: '+8.2%' },
          { label: 'Avg. Booking Value', value: `₹${avgBookingValue.toLocaleString()}`, change: '+5.1%' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
            <p className="text-luxury-gray-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-luxury-white mb-2">{stat.value}</p>
            <p className="text-green-400 text-sm">{stat.change} vs last month</p>
          </div>
        ))}
      </div>
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-luxury-white mb-4">Revenue Overview</h3>
        <div className="text-center py-8">
          <p className="text-luxury-gray-400">Total Bookings: {totalBookings}</p>
          <p className="text-luxury-gray-400">Total Revenue: ₹{totalRevenue.toLocaleString()}</p>
          <p className="text-luxury-gray-400 mt-4">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-luxury-white mb-6">Business Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-luxury-gray-400 text-sm mb-2">Business Name</label>
            <input type="text" defaultValue="Looks Trend'z Unisex Saloon" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
          </div>
          <div>
            <label className="block text-luxury-gray-400 text-sm mb-2">Contact Number</label>
            <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
          </div>
          <div>
            <label className="block text-luxury-gray-400 text-sm mb-2">Email</label>
            <input type="email" defaultValue="info@lookstrendz.com" className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white" />
          </div>
          <button onClick={() => {
            const businessName = (document.querySelector('input[defaultValue="Looks Trend\'z Unisex Saloon"]') as HTMLInputElement)?.value
            const contactNumber = (document.querySelector('input[defaultValue="+91 98765 43210"]') as HTMLInputElement)?.value
            const email = (document.querySelector('input[defaultValue="info@lookstrendz.com"]') as HTMLInputElement)?.value
            alert(`Settings saved successfully!\n\nBusiness Name: ${businessName}\nContact: ${contactNumber}\nEmail: ${email}`)
          }} className="w-full px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg transition-all">
            Save Changes
          </button>
        </div>
      </div>
      <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-luxury-white mb-6">Working Hours</h3>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center justify-between p-3 bg-luxury-black/30 rounded-lg">
              <span className="text-luxury-white font-medium">{day}</span>
              <div className="flex items-center gap-3">
                <input type="time" defaultValue="09:00" className="px-3 py-2 bg-luxury-black/50 border border-luxury-gold/20 rounded text-luxury-white text-sm" />
                <span className="text-luxury-gray-400">to</span>
                <input type="time" defaultValue="20:00" className="px-3 py-2 bg-luxury-black/50 border border-luxury-gold/20 rounded text-luxury-white text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
