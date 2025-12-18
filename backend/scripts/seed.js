require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingRecord = require('../models/ParkingRecord');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ParkingSlot.deleteMany({});
    await ParkingRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin',
      name: 'Admin User',
      role: 'admin'
    });
    console.log('Admin user created');

    // Create parking slots
    const slots = [
      { slotId: 101, status: 'available' },
      { slotId: 102, status: 'available' },
      { slotId: 103, status: 'occupied', vehicleNumber: 'ABC123', ownerName: 'John Doe', entryTime: new Date('2024-12-18T10:00:00'), exitTime: new Date('2024-12-18T18:00:00') },
      { slotId: 104, status: 'available' },
      { slotId: 105, status: 'occupied', vehicleNumber: 'XYZ789', ownerName: 'Jane Smith', entryTime: new Date('2024-12-18T09:00:00'), exitTime: new Date('2024-12-18T17:00:00') }
    ];
    await ParkingSlot.insertMany(slots);
    console.log('Parking slots created');

    // Create sample records
    const records = [
      { slotId: 101, vehicleNumber: 'DEF456', ownerName: 'Bob Johnson', entryTime: new Date('2024-12-17T08:00:00'), exitTime: new Date('2024-12-17T16:00:00'), status: 'completed' },
      { slotId: 102, vehicleNumber: 'GHI789', ownerName: 'Alice Brown', entryTime: new Date('2024-12-17T11:00:00'), exitTime: new Date('2024-12-17T19:00:00'), status: 'completed' },
      { slotId: 103, vehicleNumber: 'ABC123', ownerName: 'John Doe', entryTime: new Date('2024-12-18T10:00:00'), exitTime: new Date('2024-12-18T18:00:00'), status: 'active' },
      { slotId: 105, vehicleNumber: 'XYZ789', ownerName: 'Jane Smith', entryTime: new Date('2024-12-18T09:00:00'), exitTime: new Date('2024-12-18T17:00:00'), status: 'active' }
    ];
    await ParkingRecord.insertMany(records);
    console.log('Sample parking records created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();