import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { siteConfig } from '@/config/seo'
import type { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Premium Unisex Salon & Spa | Book Online`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    title: `${siteConfig.name} - Best Salon & Spa Near You`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Premium Salon Services`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@lookstrendz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BeautySalon',
              name: siteConfig.name,
              description: siteConfig.description,
              url: siteConfig.url,
              telephone: siteConfig.location.phone,
              email: siteConfig.location.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.location.address,
                addressLocality: siteConfig.location.city,
                addressRegion: siteConfig.location.state,
                addressCountry: siteConfig.location.country,
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 'YOUR_LATITUDE',
                longitude: 'YOUR_LONGITUDE',
              },
              openingHoursSpecification: Object.entries(siteConfig.businessHours).map(([day, hours]) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
                opens: hours.split(' - ')[0],
                closes: hours.split(' - ')[1],
              })),
              priceRange: '₹₹',
              image: siteConfig.ogImage,
              sameAs: Object.values(siteConfig.social),
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Salon Services',
                itemListElement: siteConfig.services.map((service, index) => ({
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: service,
                  },
                })),
              },
            }),
          }}
        />
      </head>
      <body className="font-sans bg-luxury-white text-luxury-black">
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0A0A0A',
                color: '#FAFAFA',
                border: '1px solid #D4AF37',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}