require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const User = require('./models/User');
const ParkingSlot = require('./models/ParkingSlot');
const ParkingRecord = require('./models/ParkingRecord');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Initialize parking slots if they don't exist
const initializeParkingSlots = async () => {
  try {
    const existingSlots = await ParkingSlot.countDocuments();
    if (existingSlots === 0) {
      const slots = [
        { slotId: 101, status: 'available' },
        { slotId: 102, status: 'available' },
        { slotId: 103, status: 'occupied', vehicleNumber: 'ABC123', ownerName: 'John Doe', entryTime: new Date('2024-01-01T10:00:00'), exitTime: new Date('2024-01-01T18:00:00') },
        { slotId: 104, status: 'available' },
        { slotId: 105, status: 'occupied', vehicleNumber: 'XYZ789', ownerName: 'Jane Smith', entryTime: new Date('2024-01-01T09:00:00'), exitTime: new Date('2024-01-01T17:00:00') }
      ];
      await ParkingSlot.insertMany(slots);
      console.log('Parking slots initialized');
    }

    // Create default admin user
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (!existingUser) {
      await User.create({
        email: 'admin@example.com',
        password: 'admin',
        name: 'Admin User',
        role: 'admin'
      });
      console.log('Default admin user created');
    }

    // Create some sample records
    const existingRecords = await ParkingRecord.countDocuments();
    if (existingRecords === 0) {
      const records = [
        { slotId: 101, vehicleNumber: 'DEF456', ownerName: 'Bob Johnson', entryTime: new Date('2024-01-01T08:00:00'), exitTime: new Date('2024-01-01T16:00:00'), status: 'completed' },
        { slotId: 102, vehicleNumber: 'GHI789', ownerName: 'Alice Brown', entryTime: new Date('2024-01-01T11:00:00'), exitTime: new Date('2024-01-01T19:00:00'), status: 'completed' }
      ];
      await ParkingRecord.insertMany(records);
      console.log('Sample parking records created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ParkMate Backend API is running!', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/parking/slots', authenticateToken, async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ slotId: 1 });
    const formattedSlots = slots.map(slot => ({
      id: slot.slotId,
      status: slot.status,
      vehicleNumber: slot.vehicleNumber,
      ownerName: slot.ownerName,
      entryTime: slot.entryTime,
      exitTime: slot.exitTime
    }));
    res.json(formattedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/parking/slots/:id', authenticateToken, async (req, res) => {
  try {
    const slot = await ParkingSlot.findOne({ slotId: parseInt(req.params.id) });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    const formattedSlot = {
      id: slot.slotId,
      status: slot.status,
      vehicleNumber: slot.vehicleNumber,
      ownerName: slot.ownerName,
      entryTime: slot.entryTime,
      exitTime: slot.exitTime
    };
    
    res.json(formattedSlot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/parking/slots/:id/book', authenticateToken, async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    const { ownerName, vehicleNumber, entryTime, exitTime } = req.body;
    
    const slot = await ParkingSlot.findOne({ slotId });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    if (slot.status === 'occupied') {
      return res.status(400).json({ message: 'Slot already occupied' });
    }
    
    // Update slot
    slot.status = 'occupied';
    slot.ownerName = ownerName;
    slot.vehicleNumber = vehicleNumber;
    slot.entryTime = new Date(entryTime);
    slot.exitTime = new Date(exitTime);
    await slot.save();
    
    // Create parking record
    const record = new ParkingRecord({
      slotId,
      ownerName,
      vehicleNumber,
      entryTime: new Date(entryTime),
      exitTime: new Date(exitTime),
      status: 'active'
    });
    await record.save();
    
    res.json({ 
      message: 'Slot booked successfully', 
      slot: {
        id: slot.slotId,
        status: slot.status,
        vehicleNumber: slot.vehicleNumber,
        ownerName: slot.ownerName,
        entryTime: slot.entryTime,
        exitTime: slot.exitTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/parking/records', authenticateToken, async (req, res) => {
  try {
    const records = await ParkingRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Release slot endpoint
app.post('/api/parking/slots/:id/release', authenticateToken, async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    
    const slot = await ParkingSlot.findOne({ slotId });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    if (slot.status === 'available') {
      return res.status(400).json({ message: 'Slot is already available' });
    }
    
    // Update active record to completed
    await ParkingRecord.findOneAndUpdate(
      { slotId, status: 'active' },
      { status: 'completed' }
    );
    
    // Reset slot
    slot.status = 'available';
    slot.ownerName = null;
    slot.vehicleNumber = null;
    slot.entryTime = null;
    slot.exitTime = null;
    await slot.save();
    
    res.json({ message: 'Slot released successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize data and start server
const startServer = async () => {
  await initializeParkingSlots();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();