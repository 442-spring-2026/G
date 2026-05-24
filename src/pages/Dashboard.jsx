import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Start with an empty list to test the empty state message
  const [medications, setMedications] = useState([]);

  // If there are no medications, show the empty state screen
  if (medications.length === 0) {
    return (
      <div className="dashboard-empty-state">
        {/* Pill icon */}
        <div className="empty-icon-wrapper" aria-hidden="true">
          <Pill size={48} className="empty-icon" />
        </div>
        
        {/* Main message */}
        <h2>Your Cabinet is Empty</h2>
        
        {/* Description text */}
        <p>You haven't tracked any medications yet. Keep your routine on track by adding your first one.</p>
        
        {/* Button to go to add medicine page */}
        <button 
          className="dashboard-add-btn"
          onClick={() => navigate('/addmedicinepage')}
        >
          <PlusCircle size={18} />
          Add Your First Medicine
        </button>
      </div>
    );
  }

  //dashboard header
  return (
    <div className="dashboard-container">
      <h1>My Medicine Cabinet</h1>
    </div>
  );
};

export default Dashboard;