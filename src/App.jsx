import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Bell } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddMedicinePage from "./pages/AddMedicinePage";
import ManageMedication from "./pages/ManageMedication";
import Navbar from "./navbar";
import SavedCabinet from "./pages/SavedCabinet";

function App() {
  const [activeReminder, setActiveReminder] = useState(null);
  const [reminderHistory, setReminderHistory] = useState(() => {
    const saved = localStorage.getItem("reminderHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const q = query(collection(db, "medications"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      meds.forEach((med) => {
        if (!med.reminderTime) return;
        const now = new Date();
        const reminderDate = new Date();
        const [hours, minutes] = med.reminderTime.split(":");
        reminderDate.setHours(hours, minutes, 0, 0);
        const delay = reminderDate - now;
        if (delay > 0) {
          setTimeout(() => setActiveReminder(med), delay);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  function saveReminderResult(status) {
    if (!activeReminder) return;
    const newRecord = {
      medicine: activeReminder.name,
      time: activeReminder.reminderTime,
      status,
      date: new Date().toLocaleString(),
    };
    const updated = [newRecord, ...reminderHistory];
    setReminderHistory(updated);
    localStorage.setItem("reminderHistory", JSON.stringify(updated));
    setActiveReminder(null);
  }

  return (
    <div className="app-shell">
      {activeReminder && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#f5efff", border: "2px solid #4b2e83", borderRadius: "12px",
          padding: "20px", zIndex: 999, minWidth: "320px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Bell size={20} color="#4b2e83" />
            <strong style={{ color: "#4b2e83" }}>Time to take your medication. Did you take it?</strong>
          </div>
          <p style={{ margin: "0 0 16px" }}><strong>{activeReminder.name}</strong> — {activeReminder.dosage}</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="primary-button" style={{ width: "auto", padding: "10px 24px" }}
              onClick={() => saveReminderResult("Taken")}>Yes</button>
            <button className="secondary-button" style={{ width: "auto", padding: "10px 24px", marginTop: 0 }}
              onClick={() => saveReminderResult("Missed")}>Ignore</button>
          </div>
        </div>
      )}
      <Routes>
        {/* Login & Signup pages have NO navbar (Requirement N1) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgotpassword" element={<Navigate to="/forgot-password" replace />} />

        {/* Main pages HAVE navbar */}
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/addmedicinepage" element={<><Navbar /><AddMedicinePage /></>} />
        <Route path="/manage/:id" element={<><Navbar /><ManageMedication /></>} />
        <Route path="/reminders" element={<><Navbar /><SavedCabinet /></>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
