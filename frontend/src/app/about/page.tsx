'use client'

import { motion } from 'framer-motion'
import { Award, Users, Heart, Star, Clock, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
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
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">OUR STORY</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-luxury-white via-luxury-gold to-luxury-white bg-clip-text text-transparent">
              About Us
            </h1>
            <div className="luxury-divider mb-8" />
            <p className="text-xl text-luxury-white/70 max-w-3xl mx-auto leading-relaxed">
              Where beauty meets excellence. Discover the story behind our passion for making you look and feel your best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-luxury-white via-luxury-beige to-luxury-white">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">SINCE 2008</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-luxury-black">
                15+ Years of Excellence
              </h2>
              <p className="text-lg text-luxury-gray-600 mb-6 leading-relaxed">
                Looks Trend'z Unisex Saloon has been a cornerstone of beauty and grooming excellence for over 15 years. What started as a small salon has grown into a premier destination for those seeking luxury beauty services.
              </p>
              <p className="text-lg text-luxury-gray-600 leading-relaxed">
                Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for thousands of clients who trust us with their beauty needs.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-luxury-gold/30 to-luxury-beige rounded-2xl flex items-center justify-center">
                <span className="text-luxury-gold/50 text-9xl font-serif">LT</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-luxury-black text-luxury-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="container-max section-padding relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-luxury-gold font-medium tracking-widest text-sm mb-4 block">OUR VALUES</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">What We Stand For</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Award className="w-8 h-8" />, title: 'Excellence', description: 'We strive for perfection in every service we provide' },
              { icon: <Heart className="w-8 h-8" />, title: 'Passion', description: 'Our love for beauty drives everything we do' },
              { icon: <Users className="w-8 h-8" />, title: 'Community', description: 'Building lasting relationships with our clients' },
              { icon: <Star className="w-8 h-8" />, title: 'Quality', description: 'Only the finest products and techniques' },
              { icon: <Clock className="w-8 h-8" />, title: 'Reliability', description: 'Consistent service you can count on' },
              { icon: <Shield className="w-8 h-8" />, title: 'Trust', description: 'Your satisfaction is our guarantee' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-luxury-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-luxury-gold/20 group-hover:border-luxury-gold/50 transition-all duration-500">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold mb-6 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-luxury-white/70">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-luxury-beige to-luxury-white">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '50K+', label: 'Happy Clients' },
              { number: '25+', label: 'Expert Staff' },
              { number: '120+', label: 'Services' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-luxury-gold mb-2">{stat.number}</div>
                <div className="text-luxury-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
