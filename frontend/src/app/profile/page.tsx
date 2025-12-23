'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: (user as any).phone || '',
      dateOfBirth: '',
      address: ''
    })
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put('/users/customer-profile', {
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined
      })
      alert('Profile created successfully!')
      router.push('/book-appointment')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black pt-32 pb-20">
      <div className="container-max px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-luxury-black/50 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-luxury-white mb-2">Complete Your Profile</h1>
            <p className="text-luxury-gray-400 mb-8">Please fill in your details to continue booking</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-luxury-gray-400 text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-luxury-gray-400 text-sm mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white"
                  required
                />
              </div>

              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white"
                />
              </div>

              <div>
                <label className="block text-luxury-gray-400 text-sm mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-luxury-black/50 border border-luxury-gold/20 rounded-lg text-luxury-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
