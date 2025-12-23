import { PrismaClient, ServiceCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const services = [
    { name: 'Silver Facial', category: 'SKIN' as ServiceCategory, price: 1200, duration: 60 },
    { name: 'Gold Facial', category: 'SKIN' as ServiceCategory, price: 1200, duration: 75 },
    { name: 'Diamond Facial', category: 'SKIN' as ServiceCategory, price: 1500, duration: 75 },
    { name: 'Hair Cut (Female)', category: 'HAIR' as ServiceCategory, price: 350, duration: 45 },
    { name: 'Hair Coloring', category: 'HAIR' as ServiceCategory, price: 4000, duration: 180 },
    { name: 'Keratin Treatment', category: 'HAIR' as ServiceCategory, price: 5000, duration: 240 },
    { name: 'Arms Wax', category: 'GROOMING' as ServiceCategory, price: 200, duration: 30 },
    { name: 'Full Body Wax', category: 'GROOMING' as ServiceCategory, price: 1200, duration: 120 },
    { name: 'Manicure', category: 'NAILS' as ServiceCategory, price: 300, duration: 45 },
    { name: 'Pedicure', category: 'NAILS' as ServiceCategory, price: 400, duration: 60 },
    { name: 'Body Massage', category: 'MASSAGE' as ServiceCategory, price: 1500, duration: 90 },
    { name: 'Bridal Package', category: 'BRIDAL' as ServiceCategory, price: 15000, duration: 240 }
  ]

  console.log('Seeding services...')
  
  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  console.log('Services seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })