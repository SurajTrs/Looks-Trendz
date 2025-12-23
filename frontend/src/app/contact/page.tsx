'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-luxury-black text-luxury-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15),transparent_70%)]" />
        <div className="container-max section-padding relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">GET IN TOUCH</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-luxury-white via-luxury-gold to-luxury-white bg-clip-text text-transparent">
              Contact Us
            </h1>
            <div className="luxury-divider mb-8" />
            <p className="text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Reach out for appointments, inquiries, or just to say hello.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-luxury-white via-luxury-beige to-luxury-white">
        <div className="container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif font-bold mb-8 text-luxury-black">Visit Our Salon</h2>
              <p className="text-lg text-luxury-gray-600 mb-10 leading-relaxed">
                Experience luxury beauty services in our elegant salon. We're here to make you look and feel amazing.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    title: 'Location',
                    content: '123 Beauty Street, Fashion District, City 110001'
                  },
                  {
                    icon: <Phone className="w-6 h-6" />,
                    title: 'Phone',
                    content: '+91 98765 43210',
                    link: 'tel:+919876543210'
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    title: 'Email',
                    content: 'info@lookstrendz.com',
                    link: 'mailto:info@lookstrendz.com'
                  },
                  {
                    icon: <Clock className="w-6 h-6" />,
                    title: 'Hours',
                    content: 'Mon - Sat: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 6:00 PM'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-14 h-14 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/20 transition-colors flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-luxury-black mb-1">{item.title}</div>
                      {item.link ? (
                        <a href={item.link} className="text-luxury-gray-600 hover:text-luxury-gold transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <div className="text-luxury-gray-600 whitespace-pre-line">{item.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Link 
                  href="/book-appointment" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-2xl" />
              <div className="relative bg-luxury-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border-2 border-luxury-gold/10">
                <h3 className="text-3xl font-bold mb-2 text-luxury-black">Send us a Message</h3>
                <p className="text-luxury-gray-600 mb-8">Fill out the form and we'll get back to you shortly</p>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-luxury-black mb-2">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-luxury-black mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-luxury-black mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-luxury-black mb-2">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us how we can help you..." 
                      className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full px-8 py-4 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-luxury-black">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-luxury-white mb-4">Find Us</h2>
            <p className="text-luxury-white/70">Located in the heart of the city</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="aspect-video bg-luxury-gray-800 rounded-2xl overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center text-luxury-white/50">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-luxury-gold" />
                <p>Map Integration</p>
                <p className="text-sm">123 Beauty Street, Fashion District</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
