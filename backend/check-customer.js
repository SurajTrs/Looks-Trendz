const { MongoClient } = require('mongodb');

async function checkCustomer() {
  const client = new MongoClient('mongodb://localhost:27017/looks_trendz_salon');
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get a user
    const user = await db.collection('users').findOne({ role: 'CUSTOMER' });
    console.log('User:', user);
    
    if (user) {
      // Check if customer profile exists
      const customer = await db.collection('customers').findOne({ userId: user._id.toString() });
      console.log('Customer profile:', customer);
      
      if (!customer) {
        console.log('Creating customer profile...');
        await db.collection('customers').insertOne({
          userId: user._id.toString(),
          loyaltyPoints: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Customer profile created');
      }
    }
  } finally {
    await client.close();
  }
}

checkCustomer().catch(console.error);
