import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { Bell, Clock, Pill, FileText, PlusCircle } from "lucide-react";
import { auth, db } from "../firebase";
import { formatDosage } from "../utils/dosage";

export default function SavedCabinet() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [reminderHistory, setReminderHistory] = useState([]);

  // ── Load medications for the current user ──────────────────────────────────
  useEffect(() => {
    async function loadMedications() {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "medications"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMedications(meds);
    }
    loadMedications();
  }, []);

  // ── Load reminder history for the current user from Firestore ──────────────
  // Fix for Issue #67: history is now stored under users/{uid}/reminderHistory
  // instead of localStorage, so it's fully isolated per account.
  useEffect(() => {
    async function loadReminderHistory() {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const historyRef = collection(
          db,
          "users",
          user.uid,
          "reminderHistory"
        );
        const q = query(historyRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReminderHistory(history);
      } catch (err) {
        console.error("Failed to load reminder history:", err);
      }
    }
    loadReminderHistory();
  }, []);

  // ── Schedule reminder popups ───────────────────────────────────────────────
  useEffect(() => {
    if (medications.length === 0) return;
    const timers = [];
     medications.forEach((med) => {
      if (!med.reminderTime) return;
      const now = new Date();
      const reminderDate = new Date();
      const [hours, minutes] = med.reminderTime.split(":");
      reminderDate.setHours(hours);
      reminderDate.setMinutes(minutes);
      reminderDate.setSeconds(0);
      reminderDate.setMilliseconds(0);
      const delay = reminderDate - now;
      if (delay > 0) {
        const timer = setTimeout(() => setActiveReminder(med), delay);
        timers.push(timer);
      }
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [medications]);

  // ── Save reminder result to Firestore (per-user subcollection) ─────────────
  async function saveReminderResult(status) {
    if (!activeReminder) return;
    const user = auth.currentUser;
    if (!user) return;

    const newRecord = {
      medicine: activeReminder.name,
      time: activeReminder.reminderTime,
      status,
      date: new Date().toLocaleString(),
      createdAt: serverTimestamp(),
    };

    try {
      // Write to users/{uid}/reminderHistory — isolated per account
      const historyRef = collection(db, "users", user.uid, "reminderHistory");
      const docRef = await addDoc(historyRef, newRecord);

      // Update local state (omit serverTimestamp for immediate display)
      setReminderHistory((prev) => [
        { id: docRef.id, ...newRecord, createdAt: null },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to save reminder result:", err);
    }

    setActiveReminder(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Reminders</h1>
        <p className="dashboard-subtitle">
          Your medication schedule and reminder history.
        </p>
      </div>

      {activeReminder && (
        <div
          style={{
            background: "#f5efff",
            border: "2px solid #4b2e83",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Bell size={20} color="#4b2e83" />
            <h2 style={{ margin: 0, color: "#4b2e83", fontSize: "1.25rem", fontWeight: "700" }}>
              Time to take your medication
            </h2>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>
            <strong>{activeReminder.name}</strong> — {formatDosage(activeReminder.dosage)}
          </p>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <button
              className="primary-button"
              style={{ width: "auto", padding: "10px 24px" }}
              onClick={() => saveReminderResult("Taken")}
            >
              Taken
            </button>
            <button
              className="secondary-button"
              style={{ width: "auto", padding: "10px 24px", marginTop: 0 }}
              onClick={() => saveReminderResult("Missed")}
            >
              Missed
            </button>
          </div>

          {/* Enhancement #66: Medical Disclaimer Notice */}
          <div style={{ 
            fontSize: "0.78rem", 
            color: "#6b5b8a", 
            borderTop: "1px solid #ddd8f0", 
            paddingTop: "10px", 
            lineHeight: "1.3",
            fontStyle: "italic"
          }}>
            ⚠️ <strong>Important Note:</strong> Ignoring or missing medication doses can be dangerous to your health. Please consult a qualified medical professional regarding any schedule adjustments or missed doses.
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "16px" }}>Upcoming Reminders</h2>

      {medications.length === 0 ? (
        <div className="dashboard-empty-state">
          <div className="empty-icon-wrapper">
            <Bell size={48} />
          </div>
          <h2>No medications added yet.</h2>
          <p>Add a medication with a reminder time to get started.</p>
          <button
            className="dashboard-add-btn"
            onClick={() => navigate("/addmedicinepage")}
          >
            <PlusCircle size={18} /> Add Medicine
          </button>
        </div>
      ) : (
        <div className="medicine-grid">
          {medications.map((med) => (
            <button
              key={med.id}
              className="medicine-card"
              onClick={() => navigate(`/manage/${med.id}`)}
            >
              <div className="card-accent-bar" />
              <div className="card-main-content">
                <div className="medicine-title-row">
                  <span className="medicine-pill-icon">
                    <Pill size={16} />
                  </span>
                  <h3>{med.name}</h3>
                  <span className="medicine-dosage-badge">{formatDosage(med.dosage)}</span>
                </div>
                <div className="medicine-details-meta">
                  <div className="meta-row">
                    <Clock size={14} />
                    <span>Reminder: {med.reminderTime || "Not set"}</span>
                  </div>
                  {med.notes && (
                    <div className="meta-row notes-preview">
                      <FileText size={14} />
                      <span className="truncate-text">{med.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "32px", marginBottom: "16px" }}>
        Reminder History
      </h2>

      {reminderHistory.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No reminder history yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reminderHistory.map((item, index) => (
            <div
              key={item.id ?? index}
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                padding: "14px 16px",
                border: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.medicine}</strong>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#6b7280",
                    fontSize: "0.85rem",
                  }}
                >
                  {item.date}
                </p>
              </div>
              <span
                style={{
                  background:
                    item.status === "Taken" ? "#d1fae5" : "#fee2e2",
                  color:
                    item.status === "Taken" ? "#065f46" : "#b91c1c",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}