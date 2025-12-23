import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-luxury-white">
      <div className="container-max section-padding py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                <span className="text-luxury-black font-bold text-sm">LT</span>
              </div>
              <span className="font-serif font-bold text-xl">
                Looks Trend&apos;z
              </span>
            </div>
            <p className="text-luxury-gray-300 text-sm leading-relaxed">
              Experience luxury beauty and grooming services in an elegant atmosphere. 
              Where style meets sophistication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'About Us', href: '/about' },
                { name: 'Book Appointment', href: '/book-appointment' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-luxury-gray-300 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                'Hair Styling & Cuts',
                'Facial Treatments',
                'Bridal Packages',
                'Grooming Services',
                'Massage Therapy',
                'Nail Care',
              ].map((service) => (
                <li key={service}>
                  <span className="text-luxury-gray-300 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <span className="text-luxury-gray-300 text-sm">
                  123 Beauty Street, Fashion District, City 110001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <span className="text-luxury-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                <span className="text-luxury-gray-300 text-sm">info@lookstrendz.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <div className="text-luxury-gray-300 text-sm">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-gray-800">
        <div className="container-max section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-luxury-gray-400 text-sm">
              © 2024 Looks Trend&apos;z Unisex Saloon. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-luxury-gray-400 hover:text-luxury-gold transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}