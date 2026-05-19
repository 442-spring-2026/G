import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function SavedCabinet() {
  const location = useLocation();
  const successMessage = location.state?.authSuccessMessage;
  const [visibleMessage, setVisibleMessage] = useState(successMessage ?? "");
  const [medications, setMedications] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [reminderHistory, setReminderHistory] = useState(() => {
    const saved = localStorage.getItem("reminderHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setVisibleMessage(successMessage ?? "");

    if (!successMessage) return;

    const timeoutId = setTimeout(() => {
      setVisibleMessage("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    async function loadMedications() {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "medications"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const meds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMedications(meds);
    }

    loadMedications();
  }, []);

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
        const timer = setTimeout(() => {
          setActiveReminder(med);
        }, delay);

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [medications]);

  function saveReminderResult(status) {
    if (!activeReminder) return;

    const newRecord = {
      medicine: activeReminder.name,
      time: activeReminder.reminderTime,
      status,
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [newRecord, ...reminderHistory];

    setReminderHistory(updatedHistory);
    localStorage.setItem("reminderHistory", JSON.stringify(updatedHistory));
    setActiveReminder(null);
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <h1>Saved Medicine Cabinet</h1>

        {visibleMessage ? (
          <p className="dashboard-success" role="status">
            {visibleMessage}
          </p>
        ) : null}

        {activeReminder ? (
          <div style={{ border: "1px solid #B7A57A", padding: "16px", marginBottom: "16px" }}>
            <h2>Reminder</h2>
            <p>
              Time to take <strong>{activeReminder.name}</strong>
            </p>

            <button onClick={() => saveReminderResult("Taken")}>
              Taken
            </button>

            <button
              onClick={() => saveReminderResult("Missed")}
              style={{ marginLeft: "8px" }}
            >
              Missed
            </button>
          </div>
        ) : null}

        {medications.length === 0 ? (
          <p>No medications added yet.</p>
        ) : (
          <div>
            {medications.map((med) => (
              <div key={med.id} style={{ borderBottom: "1px solid #ddd", padding: "12px 0" }}>
                <h3>{med.name}</h3>
                <p>{med.dosage}</p>
                <p>Reminder: {med.reminderTime}</p>
              </div>
            ))}
          </div>
        )}

        <h2>Reminder History</h2>

        {reminderHistory.length === 0 ? (
          <p>No reminder history yet.</p>
        ) : (
          reminderHistory.map((item, index) => (
            <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
              <strong>{item.medicine}</strong> — {item.time} — {item.status}
              <p style={{ margin: 0 }}>{item.date}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}