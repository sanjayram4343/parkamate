const mongoose = require('mongoose');

const parkingRecordSchema = new mongoose.Schema({
  slotId: {
    type: Number,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

parkingRecordSchema.pre('save', function(next) {
  if (this.entryTime && this.exitTime) {
    this.duration = Math.round((this.exitTime - this.entryTime) / (1000 * 60));
  }
  next();
});

module.exports = mongoose.model('ParkingRecord', parkingRecordSchema);