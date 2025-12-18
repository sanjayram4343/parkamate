import React, { useState, useEffect } from 'react';
import { parkingAPI } from '../services/api';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await parkingAPI.getRecords();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading records...</div>;
  }

  return (
    <div className="records">
      <h1>Parking Records</h1>
      
      {records.length === 0 ? (
        <div className="no-records">No parking records found.</div>
      ) : (
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Vehicle Number</th>
                <th>Owner Name</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.slotId}</td>
                  <td>{record.vehicleNumber}</td>
                  <td>{record.ownerName}</td>
                  <td>{new Date(record.entryTime).toLocaleString()}</td>
                  <td>{new Date(record.exitTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Records;