'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      router.push('/dashboard')
    } else {
      router.push('/admin/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
    </div>
  )
}
