const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Suraj:Suraj1@cluster0.fgwml28.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority&appName=Cluster0";

const services = [
  { name: 'Men\'s Haircut', description: 'Professional haircut with styling', category: 'HAIR', duration: 30, price: 300, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Women\'s Haircut', description: 'Precision cut with blow dry', category: 'HAIR', duration: 45, price: 500, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Hair Coloring (Full)', description: 'Complete hair coloring', category: 'HAIR', duration: 120, price: 2500, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Classic Facial', description: 'Deep cleansing facial', category: 'SKIN', duration: 60, price: 1200, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Gold Facial', description: 'Luxury gold facial', category: 'SKIN', duration: 75, price: 2500, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Beard Trim', description: 'Professional beard grooming', category: 'GROOMING', duration: 20, price: 200, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Bridal Makeup', description: 'Complete bridal makeup', category: 'BRIDAL', duration: 120, price: 8000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Swedish Massage', description: 'Relaxing full body massage', category: 'MASSAGE', duration: 60, price: 1500, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Basic Manicure', description: 'Nail care with polish', category: 'NAILS', duration: 30, price: 400, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('looks_trendz_salon');
    const collection = db.collection('services');
    
    await collection.deleteMany({});
    const result = await collection.insertMany(services);
    console.log(`✅ Seeded ${result.insertedCount} services successfully!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

seed();
