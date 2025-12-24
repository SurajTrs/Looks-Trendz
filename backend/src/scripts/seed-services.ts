import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ServiceCategory = 'HAIR' | 'SKIN' | 'GROOMING' | 'BRIDAL' | 'MASSAGE' | 'NAILS' | 'OTHER';

const services: Array<{
  name: string;
  description: string;
  category: ServiceCategory;
  duration: number;
  price: number;
  isActive: boolean;
}> = [
  // HAIR SERVICES
  { name: 'Men\'s Haircut', description: 'Professional haircut with styling', category: 'HAIR' as ServiceCategory, duration: 30, price: 300, isActive: true },
  { name: 'Women\'s Haircut', description: 'Precision cut with blow dry', category: 'HAIR', duration: 45, price: 500, isActive: true },
  { name: 'Kids Haircut', description: 'Haircut for children under 12', category: 'HAIR', duration: 20, price: 200, isActive: true },
  { name: 'Hair Coloring (Full)', description: 'Complete hair coloring with premium products', category: 'HAIR', duration: 120, price: 2500, isActive: true },
  { name: 'Hair Highlights', description: 'Partial highlights for dimension', category: 'HAIR', duration: 90, price: 1800, isActive: true },
  { name: 'Balayage', description: 'Hand-painted highlights technique', category: 'HAIR', duration: 150, price: 3500, isActive: true },
  { name: 'Hair Spa Treatment', description: 'Deep conditioning and nourishment', category: 'HAIR', duration: 60, price: 800, isActive: true },
  { name: 'Keratin Treatment', description: 'Smoothing and straightening treatment', category: 'HAIR', duration: 180, price: 4500, isActive: true },
  { name: 'Hair Rebonding', description: 'Permanent straightening treatment', category: 'HAIR', duration: 240, price: 5000, isActive: true },
  { name: 'Perming', description: 'Permanent wave styling', category: 'HAIR', duration: 120, price: 2800, isActive: true },
  { name: 'Blow Dry & Styling', description: 'Professional blow dry with styling', category: 'HAIR', duration: 30, price: 400, isActive: true },
  { name: 'Hair Extensions', description: 'Premium hair extension application', category: 'HAIR', duration: 180, price: 8000, isActive: true },
  { name: 'Scalp Treatment', description: 'Therapeutic scalp massage and treatment', category: 'HAIR', duration: 45, price: 600, isActive: true },
  { name: 'Dandruff Treatment', description: 'Specialized anti-dandruff therapy', category: 'HAIR', duration: 60, price: 700, isActive: true },
  { name: 'Hair Fall Treatment', description: 'Strengthening treatment for hair loss', category: 'HAIR', duration: 60, price: 900, isActive: true },

  // SKIN SERVICES
  { name: 'Classic Facial', description: 'Deep cleansing and moisturizing facial', category: 'SKIN', duration: 60, price: 1200, isActive: true },
  { name: 'Gold Facial', description: 'Luxury gold-infused facial treatment', category: 'SKIN', duration: 75, price: 2500, isActive: true },
  { name: 'Diamond Facial', description: 'Premium diamond facial for radiance', category: 'SKIN', duration: 90, price: 3000, isActive: true },
  { name: 'Anti-Aging Facial', description: 'Collagen-boosting anti-aging treatment', category: 'SKIN', duration: 90, price: 2800, isActive: true },
  { name: 'Acne Treatment Facial', description: 'Specialized treatment for acne-prone skin', category: 'SKIN', duration: 75, price: 1800, isActive: true },
  { name: 'Brightening Facial', description: 'Skin brightening and pigmentation treatment', category: 'SKIN', duration: 60, price: 1500, isActive: true },
  { name: 'Hydra Facial', description: 'Deep hydration and exfoliation treatment', category: 'SKIN', duration: 60, price: 2200, isActive: true },
  { name: 'Oxygen Facial', description: 'Oxygen-infused rejuvenation therapy', category: 'SKIN', duration: 75, price: 2600, isActive: true },
  { name: 'Chemical Peel', description: 'Professional chemical exfoliation', category: 'SKIN', duration: 45, price: 2000, isActive: true },
  { name: 'Microdermabrasion', description: 'Mechanical exfoliation for smooth skin', category: 'SKIN', duration: 60, price: 2400, isActive: true },
  { name: 'Under Eye Treatment', description: 'Dark circle and puffiness reduction', category: 'SKIN', duration: 30, price: 800, isActive: true },
  { name: 'Tan Removal', description: 'De-tan treatment for face and body', category: 'SKIN', duration: 90, price: 1600, isActive: true },
  { name: 'Skin Polishing', description: 'Full face polishing for glow', category: 'SKIN', duration: 45, price: 1200, isActive: true },

  // GROOMING SERVICES
  { name: 'Beard Trim & Styling', description: 'Professional beard grooming', category: 'GROOMING', duration: 20, price: 200, isActive: true },
  { name: 'Beard Coloring', description: 'Natural beard color application', category: 'GROOMING', duration: 30, price: 400, isActive: true },
  { name: 'Clean Shave', description: 'Traditional hot towel shave', category: 'GROOMING', duration: 25, price: 250, isActive: true },
  { name: 'Face Waxing', description: 'Facial hair removal with wax', category: 'GROOMING', duration: 15, price: 150, isActive: true },
  { name: 'Full Body Waxing (Men)', description: 'Complete body hair removal', category: 'GROOMING', duration: 90, price: 2000, isActive: true },
  { name: 'Full Body Waxing (Women)', description: 'Complete body hair removal', category: 'GROOMING', duration: 120, price: 2500, isActive: true },
  { name: 'Arms & Legs Waxing', description: 'Hair removal for arms and legs', category: 'GROOMING', duration: 45, price: 800, isActive: true },
  { name: 'Bikini Waxing', description: 'Bikini area hair removal', category: 'GROOMING', duration: 30, price: 600, isActive: true },
  { name: 'Brazilian Waxing', description: 'Complete intimate area waxing', category: 'GROOMING', duration: 45, price: 1200, isActive: true },
  { name: 'Threading (Eyebrows)', description: 'Precision eyebrow shaping', category: 'GROOMING', duration: 10, price: 100, isActive: true },
  { name: 'Threading (Full Face)', description: 'Complete facial threading', category: 'GROOMING', duration: 20, price: 250, isActive: true },
  { name: 'Eyebrow Tinting', description: 'Eyebrow color enhancement', category: 'GROOMING', duration: 15, price: 300, isActive: true },
  { name: 'Eyelash Tinting', description: 'Eyelash color enhancement', category: 'GROOMING', duration: 20, price: 400, isActive: true },
  { name: 'Eyelash Extensions', description: 'Semi-permanent lash extensions', category: 'GROOMING', duration: 90, price: 2500, isActive: true },

  // BRIDAL SERVICES
  { name: 'Bridal Makeup', description: 'Complete bridal makeup with HD finish', category: 'BRIDAL', duration: 120, price: 8000, isActive: true },
  { name: 'Engagement Makeup', description: 'Elegant engagement look', category: 'BRIDAL', duration: 90, price: 5000, isActive: true },
  { name: 'Pre-Bridal Package (7 Days)', description: 'Complete pre-bridal grooming package', category: 'BRIDAL', duration: 420, price: 15000, isActive: true },
  { name: 'Pre-Bridal Package (15 Days)', description: 'Extensive pre-bridal preparation', category: 'BRIDAL', duration: 900, price: 25000, isActive: true },
  { name: 'Bridal Hair Styling', description: 'Elaborate bridal hairstyle', category: 'BRIDAL', duration: 90, price: 3500, isActive: true },
  { name: 'Bridal Mehndi', description: 'Traditional bridal henna design', category: 'BRIDAL', duration: 180, price: 5000, isActive: true },
  { name: 'Saree Draping', description: 'Professional saree draping service', category: 'BRIDAL', duration: 30, price: 800, isActive: true },
  { name: 'Groom Makeup', description: 'Natural grooming for groom', category: 'BRIDAL', duration: 60, price: 3000, isActive: true },
  { name: 'Party Makeup', description: 'Glamorous party makeup', category: 'BRIDAL', duration: 60, price: 2500, isActive: true },
  { name: 'Airbrush Makeup', description: 'Flawless airbrush makeup application', category: 'BRIDAL', duration: 90, price: 6000, isActive: true },

  // MASSAGE SERVICES
  { name: 'Swedish Massage', description: 'Relaxing full body massage', category: 'MASSAGE', duration: 60, price: 1500, isActive: true },
  { name: 'Deep Tissue Massage', description: 'Therapeutic deep muscle massage', category: 'MASSAGE', duration: 75, price: 2000, isActive: true },
  { name: 'Aromatherapy Massage', description: 'Essential oil-based relaxation massage', category: 'MASSAGE', duration: 90, price: 2500, isActive: true },
  { name: 'Hot Stone Massage', description: 'Heated stone therapy massage', category: 'MASSAGE', duration: 90, price: 2800, isActive: true },
  { name: 'Thai Massage', description: 'Traditional Thai stretching massage', category: 'MASSAGE', duration: 90, price: 2200, isActive: true },
  { name: 'Head & Shoulder Massage', description: 'Stress relief massage for upper body', category: 'MASSAGE', duration: 30, price: 600, isActive: true },
  { name: 'Foot Reflexology', description: 'Therapeutic foot pressure point massage', category: 'MASSAGE', duration: 45, price: 800, isActive: true },
  { name: 'Back Massage', description: 'Targeted back pain relief massage', category: 'MASSAGE', duration: 45, price: 900, isActive: true },
  { name: 'Couple Massage', description: 'Relaxing massage for two', category: 'MASSAGE', duration: 90, price: 4500, isActive: true },
  { name: 'Prenatal Massage', description: 'Safe massage for expecting mothers', category: 'MASSAGE', duration: 60, price: 1800, isActive: true },

  // NAIL SERVICES
  { name: 'Basic Manicure', description: 'Nail shaping, cuticle care, and polish', category: 'NAILS', duration: 30, price: 400, isActive: true },
  { name: 'Basic Pedicure', description: 'Foot care with nail polish', category: 'NAILS', duration: 45, price: 500, isActive: true },
  { name: 'Gel Manicure', description: 'Long-lasting gel polish manicure', category: 'NAILS', duration: 45, price: 800, isActive: true },
  { name: 'Gel Pedicure', description: 'Long-lasting gel polish pedicure', category: 'NAILS', duration: 60, price: 900, isActive: true },
  { name: 'Spa Manicure', description: 'Luxury manicure with hand massage', category: 'NAILS', duration: 60, price: 1000, isActive: true },
  { name: 'Spa Pedicure', description: 'Luxury pedicure with foot massage', category: 'NAILS', duration: 75, price: 1200, isActive: true },
  { name: 'Nail Art (Per Nail)', description: 'Custom nail art design', category: 'NAILS', duration: 10, price: 100, isActive: true },
  { name: 'Acrylic Nails (Full Set)', description: 'Full set of acrylic nail extensions', category: 'NAILS', duration: 120, price: 2500, isActive: true },
  { name: 'Nail Extension Refill', description: 'Acrylic nail maintenance', category: 'NAILS', duration: 60, price: 1200, isActive: true },
  { name: 'Nail Extension Removal', description: 'Safe removal of artificial nails', category: 'NAILS', duration: 30, price: 500, isActive: true },
  { name: 'French Manicure', description: 'Classic French tip manicure', category: 'NAILS', duration: 45, price: 700, isActive: true },
  { name: 'Paraffin Wax Treatment', description: 'Moisturizing paraffin hand treatment', category: 'NAILS', duration: 30, price: 600, isActive: true },

  // OTHER SERVICES
  { name: 'Makeup Consultation', description: 'Personalized makeup advice session', category: 'OTHER', duration: 30, price: 500, isActive: true },
  { name: 'Hair Consultation', description: 'Expert hair care consultation', category: 'OTHER', duration: 20, price: 300, isActive: true },
  { name: 'Skin Analysis', description: 'Professional skin type analysis', category: 'OTHER', duration: 30, price: 400, isActive: true },
  { name: 'Makeup Trial', description: 'Trial makeup session before event', category: 'OTHER', duration: 60, price: 1500, isActive: true },
  { name: 'Hair Trial', description: 'Trial hairstyle before event', category: 'OTHER', duration: 45, price: 1000, isActive: true },
  { name: 'Ear Piercing', description: 'Professional ear piercing service', category: 'OTHER', duration: 15, price: 500, isActive: true },
  { name: 'Nose Piercing', description: 'Professional nose piercing service', category: 'OTHER', duration: 15, price: 600, isActive: true },
];

async function seedServices() {
  console.log('🌱 Seeding services...');

  try {
    await prisma.service.deleteMany({});
    console.log('✅ Cleared existing services');

    const result = await prisma.service.createMany({
      data: services,
    } as any);

    console.log(`✅ Created ${result.count} services`);

    const categories = ['HAIR', 'SKIN', 'GROOMING', 'BRIDAL', 'MASSAGE', 'NAILS', 'OTHER'];
    console.log('\n📊 Services by Category:');
    for (const category of categories) {
      const count = services.filter(s => s.category === category).length;
      console.log(`   ${category}: ${count} services`);
    }

    console.log('\n✨ Service seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();
