import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingAPI } from '../services/api';

const ParkingSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await parkingAPI.getSlots();
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (slot) => {
    if (slot.status === 'available') {
      navigate('/book', { state: { selectedSlotId: slot.id } });
    } else {
      try {
        const response = await parkingAPI.getSlotDetails(slot.id);
        setSelectedSlot(response.data);
      } catch (error) {
        console.error('Error fetching slot details:', error);
      }
    }
  };

  const handleReleaseSlot = async () => {
    if (!selectedSlot) return;
    
    try {
      await parkingAPI.releaseSlot(selectedSlot.id);
      setSelectedSlot(null);
      fetchSlots(); // Refresh the slots
    } catch (error) {
      console.error('Error releasing slot:', error);
      alert('Failed to release slot');
    }
  };

  if (loading) {
    return <div className="loading">Loading slots...</div>;
  }

  return (
    <div className="parking-slots">
      <h1>Parking Slots</h1>
      
      <div className="slots-grid">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`slot-card ${slot.status}`}
            onClick={() => handleSlotClick(slot)}
          >
            <div className="slot-id">Slot {slot.id}</div>
            <div className="slot-status">{slot.status}</div>
            <div className="slot-action">
              {slot.status === 'available' ? 'Click to book' : 'Click for details'}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <div className="modal-overlay" onClick={() => setSelectedSlot(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Slot {selectedSlot.id} Details</h2>
            <div className="slot-details">
              <p><strong>Status:</strong> {selectedSlot.status}</p>
              <p><strong>Vehicle Number:</strong> {selectedSlot.vehicleNumber}</p>
              <p><strong>Owner Name:</strong> {selectedSlot.ownerName}</p>
              <p><strong>Entry Time:</strong> {new Date(selectedSlot.entryTime).toLocaleString()}</p>
              <p><strong>Exit Time:</strong> {new Date(selectedSlot.exitTime).toLocaleString()}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleReleaseSlot} className="release-btn">
                Release Slot
              </button>
              <button onClick={() => setSelectedSlot(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingSlots;