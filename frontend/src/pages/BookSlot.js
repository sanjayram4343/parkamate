import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parkingAPI } from '../services/api';

const BookSlot = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    vehicleNumber: '',
    entryTime: '',
    exitTime: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAvailableSlots();
    if (location.state?.selectedSlotId) {
      setSelectedSlotId(location.state.selectedSlotId);
    }
  }, [location.state]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await parkingAPI.getSlots();
      const available = response.data.filter(slot => slot.status === 'available');
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setError('Please select a parking slot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await parkingAPI.bookSlot(selectedSlotId, formData);
      navigate('/slots');
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-slot">
      <h1>Book Parking Slot</h1>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Select Slot:</label>
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            required
          >
            <option value="">Choose a slot</option>
            {availableSlots.map(slot => (
              <option key={slot.id} value={slot.id}>
                Slot {slot.id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Owner Name:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
            placeholder="Enter owner name"
          />
        </div>

        <div className="form-group">
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            required
            placeholder="Enter vehicle number"
          />
        </div>

        <div className="form-group">
          <label>Entry Time:</label>
          <input
            type="datetime-local"
            name="entryTime"
            value={formData.entryTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Exit Time:</label>
          <input
            type="datetime-local"
            name="exitTime"
            value={formData.exitTime}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Slot'}
        </button>
      </form>
    </div>
  );
};

export default BookSlot;