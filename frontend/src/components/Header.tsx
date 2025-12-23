'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, Calendar, Phone } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/95 backdrop-blur-md shadow-2xl border-b border-luxury-gold/20">
      <div className="container-max px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-18 h-18 group-hover:scale-110 transition-transform">
              <Image 
                src="/images/logo.png" 
                alt="Looks Trendz Logo" 
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl leading-tight text-luxury-white">
                Looks Trend&apos;z
              </span>
              <span className="text-luxury-gold text-sm tracking-wider font-medium">UNISEX SALOON</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 font-medium text-luxury-white hover:text-luxury-gold transition-colors group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="tel:+919876543210"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-luxury-white/80 hover:text-luxury-gold hover:bg-luxury-gold/10 transition-all group"
            >
              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">+91 98765 43210</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="px-5 py-2.5 rounded-lg border-2 border-luxury-gold/30 text-luxury-white hover:bg-luxury-gold/10 transition-all font-medium">
                  <User className="w-4 h-4 mr-2 inline" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-luxury-white/70 hover:text-luxury-gold transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="px-5 py-2.5 rounded-lg font-medium text-luxury-white hover:text-luxury-gold transition-all">
                  Login
                </Link>
                <Link href="/book-appointment" className="px-6 py-2.5 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-luxury-gold/10 text-luxury-white hover:bg-luxury-gold/20 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-black/98 backdrop-blur-md border-t border-luxury-gold/20"
          >
            <div className="section-padding py-6 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-luxury-white hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-luxury-gold/20 space-y-3">
                <Link
                  href="tel:+919876543210"
                  className="flex items-center gap-2 px-4 py-3 text-luxury-white/80 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-all"
                >
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </Link>
                
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 border-2 border-luxury-gold/30 text-luxury-white hover:bg-luxury-gold/10 rounded-lg text-center font-medium transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-luxury-white/70 hover:text-luxury-gold transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-3 text-luxury-white hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg font-medium transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/book-appointment"
                      className="block px-4 py-3 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg text-center font-semibold hover:shadow-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}