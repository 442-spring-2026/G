import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

import { Pill, PlusCircle, Clock, FileText } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Start with an empty list to test the empty state message
  const [medications, setMedications] = useState([]);
    useEffect(() => {
    async function loadMedications() {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "medications"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMedications(meds);
    }
    loadMedications();
  }, []);


  // If there are no medications, show the empty state screen
  if (medications.length === 0) {
    return (
      <div className="dashboard-empty-state">
        {/* Pill icon */}
        <div className="empty-icon-wrapper" aria-hidden="true">
          <Pill size={48} className="empty-icon" />
        </div>
        
        {/* Main message */}
        <h2>No medications added yet.</h2>
        
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

  // issue #12: Grid container loops through medications and handles click redirects
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Medicine Cabinet</h1>
        <p className="dashboard-subtitle">Track and manage your current daily routines.</p>
      </div>

      {/* Grid rendering clickable medication list cards */}
      <div className="medicine-grid" role="list" aria-label="Medication cards">
        {medications.map((med) => (
          <button 
            key={med.id} 
            className="medicine-card"
            style={{ textAlign: 'left', width: '100%' }}
            onClick={() => navigate(`/manage/${med.id}`)}
            aria-label={`Manage ${med.name}, dosage ${med.dosage}. Reminder scheduled at ${med.reminderTime}.`}
          >
            {/* Visual accent*/}
            <div className="card-accent-bar"></div>
            
            <div className="card-main-content">
              <div className="medicine-info-block">
                <div className="medicine-title-row">
                  <span className="medicine-pill-icon" aria-hidden="true">
                    <Pill size={16} />
                  </span>
                  <h3>{med.name}</h3>
                  <span className="medicine-dosage-badge">{med.dosage}</span>
                </div>
                
                <div className="medicine-details-meta">
                  {/* Time */}
                  <div className="meta-row">
                    <Clock size={14} aria-hidden="true" />
                    <span>Scheduled for: {med.reminderTime}</span>
                  </div>
                  {/* Optional Notes */}
                  {med.notes && (
                    <div className="meta-row notes-preview">
                      <FileText size={14} aria-hidden="true" />
                      <span className="truncate-text">{med.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;


