'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Clock, IndianRupee, Star, Filter } from 'lucide-react'
import Link from 'next/link'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { servicesAPI } from '@/lib/api'

const categoryNames = {
  HAIR: 'Hair Services',
  SKIN: 'Skin Care',
  GROOMING: 'Grooming',
  BRIDAL: 'Bridal Packages',
  MASSAGE: 'Massage Therapy',
  NAILS: 'Nail Care',
  OTHER: 'Other Services'
}

const categoryDescriptions = {
  HAIR: 'Professional hair cutting, styling, coloring, and treatments',
  SKIN: 'Rejuvenating facials and advanced skincare treatments',
  GROOMING: 'Complete grooming services for the modern gentleman',
  BRIDAL: 'Comprehensive bridal makeover packages for your special day',
  MASSAGE: 'Relaxing and therapeutic massage treatments',
  NAILS: 'Professional manicure, pedicure, and nail art services',
  OTHER: 'Additional beauty and wellness services'
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const { data: servicesData, isLoading } = useQuery('services', servicesAPI.getAll)

  const services = servicesData?.data.services || {}
  const allServices = Object.values(services).flat()

  // Filter services
  const filteredServices = allServices.filter((service: any) => {
    if (selectedCategory !== 'all' && service.category !== selectedCategory) {
      return false
    }
    
    if (priceRange !== 'all') {
      const price = service.price
      switch (priceRange) {
        case 'under-1000':
          return price < 1000
        case '1000-3000':
          return price >= 1000 && price <= 3000
        case '3000-5000':
          return price >= 3000 && price <= 5000
        case 'above-5000':
          return price > 5000
        default:
          return true
      }
    }
    
    return true
  })

  const categories = Object.keys(services)

  return (
    <div className="min-h-screen bg-luxury-beige">
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
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">PREMIUM SERVICES</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-luxury-white via-luxury-gold to-luxury-white bg-clip-text text-transparent">
              Our Services
            </h1>
            <div className="luxury-divider mb-8" />
            <p className="text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of premium beauty and grooming services, 
              crafted to enhance your natural beauty and boost your confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 bg-gradient-to-b from-luxury-white via-luxury-beige to-luxury-white">
        <div className="container-max section-padding">
          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-luxury-black">
                  {filteredServices.length} Services Available
                </h2>
                <p className="text-luxury-gray-600 mt-1">Find the perfect service for you</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 bg-luxury-gold/10 text-luxury-black rounded-lg hover:bg-luxury-gold/20 transition-all flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-luxury-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-luxury-gold/10">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-luxury-black mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryNames[category as keyof typeof categoryNames]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-luxury-black mb-3">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="input-field bg-luxury-beige/50 border-luxury-gold/20 focus:border-luxury-gold"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-1000">Under ₹1,000</option>
                    <option value="1000-3000">₹1,000 - ₹3,000</option>
                    <option value="3000-5000">₹3,000 - ₹5,000</option>
                    <option value="above-5000">Above ₹5,000</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
              <p className="text-luxury-gray-600">Loading services...</p>
            </div>
          ) : (
            <>
              {/* Services by Category */}
              {selectedCategory === 'all' ? (
                <div className="space-y-20">
                  {categories.map((category) => (
                    <motion.section
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-luxury-gold/10 rounded-full text-luxury-gold text-sm font-medium mb-4">
                          {category}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-4">
                          {categoryNames[category as keyof typeof categoryNames]}
                        </h2>
                        <p className="text-lg text-luxury-gray-600 max-w-2xl mx-auto">
                          {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services[category]?.map((service: any, index: number) => (
                          <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                      </div>
                    </motion.section>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service: any, index: number) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                  ))}
                </div>
              )}

              {filteredServices.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-luxury-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-luxury-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-black mb-2">
                    No services found
                  </h3>
                  <p className="text-luxury-gray-600">
                    Try adjusting your filters to see more services.
                  </p>
                </div>
              )}
            </>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mt-20 p-12 bg-luxury-black text-luxury-white rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.2),transparent_70%)]" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Ready to Book Your Appointment?
              </h2>
              <p className="text-luxury-white/70 mb-8 text-lg">
                Experience luxury beauty services with our expert professionals
              </p>
              <Link href="/book-appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-lg font-semibold hover:shadow-lg hover:shadow-luxury-gold/50 hover:scale-105 transition-all">
                Book Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative card bg-luxury-white/80 backdrop-blur-sm border-2 border-luxury-gold/10 group-hover:border-luxury-gold/30 transition-all duration-500 h-full">
        <div className="aspect-w-16 aspect-h-10 mb-4 rounded-xl overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-luxury-gold/30 to-luxury-beige flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <span className="text-luxury-gold/50 text-5xl font-serif">{service.category[0]}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="inline-block px-3 py-1 bg-luxury-gold/10 rounded-full text-luxury-gold text-xs font-medium mb-2">
              {service.category}
            </div>
            <h3 className="text-xl font-bold text-luxury-black group-hover:text-luxury-gold transition-colors mb-2">
              {service.name}
            </h3>
            <p className="text-luxury-gray-600 text-sm line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-luxury-gray-500 py-3 border-y border-luxury-gold/10">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-luxury-gold fill-current" />
              <span className="font-medium">4.8</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-luxury-gold font-bold text-xl">
              <IndianRupee className="w-5 h-5" />
              <span>{service.price}</span>
            </div>
            <Link
              href={`/book-appointment?service=${service.id}`}
              className="text-luxury-black hover:text-luxury-gold transition-colors font-semibold group/link flex items-center gap-1"
            >
              Book Now
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}