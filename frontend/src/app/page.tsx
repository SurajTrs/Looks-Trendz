'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Star, Users, Award, Phone, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const services = [
  {
    id: 1,
    name: 'Premium Hair Styling',
    description: 'Expert cuts, colors, and treatments for all hair types',
    price: 'From ₹1,500',
    image: '/images/hair-service.jpg',
    category: 'HAIR'
  },
  {
    id: 2,
    name: 'Luxury Facial Treatments',
    description: 'Rejuvenating facials with premium skincare products',
    price: 'From ₹2,500',
    image: '/images/facial-service.jpg',
    category: 'SKIN'
  },
  {
    id: 3,
    name: 'Bridal Packages',
    description: 'Complete bridal makeover for your special day',
    price: 'From ₹15,000',
    image: '/images/bridal-service.jpg',
    category: 'BRIDAL'
  },
  {
    id: 4,
    name: 'Grooming Services',
    description: 'Professional grooming for the modern gentleman',
    price: 'From ₹800',
    image: '/images/grooming-service.jpg',
    category: 'GROOMING'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely amazing experience! The staff is professional and the ambiance is luxurious.',
    service: 'Bridal Package'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    rating: 5,
    comment: 'Best salon in the city. Great service and attention to detail.',
    service: 'Hair Styling'
  },
  {
    id: 3,
    name: 'Anita Desai',
    rating: 5,
    comment: 'Love the facial treatments here. My skin feels amazing after every visit.',
    service: 'Facial Treatment'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-black/80 to-luxury-gold/20 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-float"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")'
          }}
        />
        
        <div className="relative z-20 text-center text-luxury-white section-padding container-max">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-block px-6 py-2 bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 rounded-full mb-6">
                <span className="text-luxury-gold font-medium tracking-wider text-sm">PREMIUM SALON EXPERIENCE</span>
              </div>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-luxury-white via-luxury-gold to-luxury-white bg-clip-text text-transparent animate-shimmer">
                Looks Trend&apos;z
              </span>
              <span className="block text-luxury-gold mt-2 drop-shadow-2xl">Unisex Saloon</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-luxury-white/90"
            >
              Experience luxury beauty and grooming services in an elegant atmosphere. 
              <span className="block mt-2 text-luxury-gold font-medium">Where style meets sophistication.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/book-appointment" className="btn-primary text-lg px-10 py-5 shadow-2xl hover:shadow-luxury-gold/50 group">
                <CalendarDays className="w-6 h-6 mr-2 inline group-hover:rotate-12 transition-transform" />
                Book Appointment
              </Link>
              <Link href="/services" className="btn-outline text-lg px-10 py-5 backdrop-blur-sm">
                View Services
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex justify-center gap-12 text-sm"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-1">15+</div>
                <div className="text-luxury-white/70">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-1">50K+</div>
                <div className="text-luxury-white/70">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-1">120+</div>
                <div className="text-luxury-white/70">Services</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-luxury-gold/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-luxury-gold rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 bg-gradient-to-b from-luxury-white via-luxury-beige to-luxury-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold rounded-full blur-3xl" />
        </div>
        
        <div className="container-max section-padding relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">EXCELLENCE IN EVERY DETAIL</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-luxury-black via-luxury-gold to-luxury-black bg-clip-text text-transparent">Why Choose Us</h2>
            <div className="luxury-divider mb-6" />
            <p className="text-xl text-luxury-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide exceptional beauty and grooming services with attention to every detail
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Expert Professionals',
                description: 'Certified stylists and beauticians with years of experience',
                stat: '25+ Experts'
              },
              {
                icon: <Award className="w-10 h-10" />,
                title: 'Premium Products',
                description: 'We use only the finest, internationally acclaimed beauty products',
                stat: 'Top Brands'
              },
              {
                icon: <Star className="w-10 h-10" />,
                title: 'Luxury Experience',
                description: 'Elegant ambiance and personalized service for every client',
                stat: '5-Star Rated'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="card text-center relative bg-luxury-white/80 backdrop-blur-sm border-2 border-transparent group-hover:border-luxury-gold/30 transition-all duration-500 h-full">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-2xl text-luxury-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-luxury-gold transition-colors">{feature.title}</h3>
                  <p className="text-luxury-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="inline-block px-4 py-2 bg-luxury-gold/10 rounded-full text-luxury-gold font-semibold text-sm">
                    {feature.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-6 bg-luxury-black text-luxury-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        
        <div className="container-max section-padding relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">COMPREHENSIVE BEAUTY SOLUTIONS</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Services</h2>
            <div className="luxury-divider mb-6" />
            <p className="text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed">
              Comprehensive beauty and grooming services tailored to your needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-luxury-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-luxury-gold/20 group-hover:border-luxury-gold/50 transition-all duration-500">
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <div className="w-full h-56 bg-gradient-to-br from-luxury-gold/20 to-luxury-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <span className="text-luxury-gold/50 text-6xl font-serif">{service.category[0]}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-luxury-gold/10 rounded-full text-luxury-gold text-xs font-medium mb-3">
                      {service.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-luxury-gold transition-colors">{service.name}</h3>
                    <p className="text-luxury-white/60 mb-4 text-sm leading-relaxed">{service.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-luxury-gold/10">
                      <span className="text-luxury-gold font-bold text-lg">{service.price}</span>
                      <Link 
                        href={`/book-appointment?service=${service.id}`}
                        className="text-luxury-white hover:text-luxury-gold transition-colors font-medium group/link flex items-center gap-1"
                      >
                        Book Now 
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link href="/services" className="btn-primary text-lg px-10 py-4">
              View All 120+ Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-6 bg-gradient-to-b from-luxury-beige via-luxury-white to-luxury-beige relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-luxury-gold rounded-full blur-3xl" />
        </div>
        
        <div className="container-max section-padding relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">CLIENT TESTIMONIALS</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-luxury-black via-luxury-gold to-luxury-black bg-clip-text text-transparent">What Our Clients Say</h2>
            <div className="luxury-divider mb-6" />
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-luxury-white rounded-2xl p-8 shadow-lg border-2 border-luxury-gold/10 group-hover:border-luxury-gold/30 transition-all duration-500 h-full">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-luxury-gold fill-current" />
                    ))}
                  </div>
                  <p className="mb-6 text-luxury-gray-700 italic text-lg leading-relaxed">&quot;{testimonial.comment}&quot;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-luxury-gold/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center text-luxury-white font-bold text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-luxury-black">{testimonial.name}</p>
                      <p className="text-luxury-gold text-sm font-medium">{testimonial.service}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 bg-luxury-black text-luxury-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15),transparent_70%)]" />
        
        <div className="container-max section-padding relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">GET IN TOUCH</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">Visit Our Salon</h2>
              <p className="text-xl text-luxury-white/70 mb-10 leading-relaxed">
                Experience luxury beauty services in our elegant salon. Book your appointment today.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-luxury-gold/20 transition-colors">
                    <MapPin className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Location</div>
                    <span className="text-luxury-white/70">123 Beauty Street, Fashion District, City 110001</span>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-luxury-gold/20 transition-colors">
                    <Phone className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <span className="text-luxury-white/70">+91 98765 43210</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link href="/contact" className="btn-primary px-8 py-4">
                  Get Directions
                </Link>
                <Link href="/book-appointment" className="btn-outline px-8 py-4">
                  Book Now
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-2xl" />
              <div className="relative bg-luxury-gray-900/50 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-luxury-gold/20">
                <h3 className="text-3xl font-bold mb-2">Quick Booking</h3>
                <p className="text-luxury-white/60 mb-8">Request a callback and we'll reach out to you</p>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-luxury-white/80">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="input-field bg-luxury-black/50 border-luxury-gold/20 text-luxury-white placeholder:text-luxury-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-luxury-white/80">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="input-field bg-luxury-black/50 border-luxury-gold/20 text-luxury-white placeholder:text-luxury-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-luxury-white/80">Select Service</label>
                    <select className="input-field bg-luxury-black/50 border-luxury-gold/20 text-luxury-white">
                      <option>Choose a service</option>
                      <option>Hair Styling</option>
                      <option>Facial Treatment</option>
                      <option>Bridal Package</option>
                      <option>Grooming</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-lg">
                    Request Callback
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}