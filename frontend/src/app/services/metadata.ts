import { Metadata } from 'next'
import { siteConfig } from '@/config/seo'

export const metadata: Metadata = {
  title: 'Our Services - Hair, Skin, Bridal, Grooming & More',
  description: 'Explore 120+ premium salon services including hair styling, facials, bridal makeup, men\'s grooming, nail art, and spa treatments. Book online now!',
  keywords: [
    'salon services',
    'hair services',
    'facial treatment',
    'bridal makeup',
    'men grooming',
    'nail art',
    'spa services',
    'hair coloring',
    'hair spa',
    'skin care'
  ],
  openGraph: {
    title: 'Premium Salon Services | Looks Trend\'z',
    description: '120+ professional beauty and grooming services. Hair, skin, bridal, spa, and more.',
    url: `${siteConfig.url}/services`,
  },
}
