// First create users for staff
db.users.insertMany([
  {
    email: "stylist1@lookstrendz.com",
    phone: "9876543210",
    password: "$2b$10$YourHashedPasswordHere",
    firstName: "Priya",
    lastName: "Sharma",
    role: "STAFF",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "stylist2@lookstrendz.com",
    phone: "9876543211",
    password: "$2b$10$YourHashedPasswordHere",
    firstName: "Rahul",
    lastName: "Kumar",
    role: "STAFF",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "beautician1@lookstrendz.com",
    phone: "9876543212",
    password: "$2b$10$YourHashedPasswordHere",
    firstName: "Anjali",
    lastName: "Verma",
    role: "STAFF",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "therapist1@lookstrendz.com",
    phone: "9876543213",
    password: "$2b$10$YourHashedPasswordHere",
    firstName: "Vikram",
    lastName: "Singh",
    role: "STAFF",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get user IDs
const user1 = db.users.findOne({email: "stylist1@lookstrendz.com"});
const user2 = db.users.findOne({email: "stylist2@lookstrendz.com"});
const user3 = db.users.findOne({email: "beautician1@lookstrendz.com"});
const user4 = db.users.findOne({email: "therapist1@lookstrendz.com"});

// Create staff records
db.staff.insertMany([
  {
    userId: user1._id,
    employeeId: "EMP001",
    position: "Senior Hair Stylist",
    commissionRate: 15,
    workingHours: {monday: "9:00-18:00", tuesday: "9:00-18:00", wednesday: "9:00-18:00", thursday: "9:00-18:00", friday: "9:00-18:00", saturday: "9:00-18:00"},
    isAvailable: true,
    serviceIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: user2._id,
    employeeId: "EMP002",
    position: "Hair Stylist",
    commissionRate: 12,
    workingHours: {monday: "9:00-18:00", tuesday: "9:00-18:00", wednesday: "9:00-18:00", thursday: "9:00-18:00", friday: "9:00-18:00", saturday: "9:00-18:00"},
    isAvailable: true,
    serviceIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: user3._id,
    employeeId: "EMP003",
    position: "Senior Beautician",
    commissionRate: 15,
    workingHours: {monday: "9:00-18:00", tuesday: "9:00-18:00", wednesday: "9:00-18:00", thursday: "9:00-18:00", friday: "9:00-18:00", saturday: "9:00-18:00"},
    isAvailable: true,
    serviceIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: user4._id,
    employeeId: "EMP004",
    position: "Massage Therapist",
    commissionRate: 10,
    workingHours: {monday: "9:00-18:00", tuesday: "9:00-18:00", wednesday: "9:00-18:00", thursday: "9:00-18:00", friday: "9:00-18:00", saturday: "9:00-18:00"},
    isAvailable: true,
    serviceIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Staff members created successfully!");
