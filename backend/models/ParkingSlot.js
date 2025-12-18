const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotId: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
  vehicleNumber: {
    type: String,
    default: null
  },
  ownerName: {
    type: String,
    default: null
  },
  entryTime: {
    type: Date,
    default: null
  },
  exitTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);