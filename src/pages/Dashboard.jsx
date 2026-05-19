import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // empty array for empty state
  const [medications, setMedications] = useState([]);

  if (medications.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <div className="empty-icon-wrapper">
          <Pill size={48} className="empty-icon" />
        </div>
        <h2>Your Cabinet is Empty</h2>
        <p>You haven't tracked any medications yet. Keep your routine on track by adding your first one.</p>
        <button 
          className="dashboard-add-btn"
          onClick={() => navigate('/add')}
        >
          <PlusCircle size={18} />
          Add Your First Medicine
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>My Medicine Cabinet</h1>
    </div>
  );
};

export default Dashboard;