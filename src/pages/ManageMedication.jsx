import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMockMedicineById } from "../services/firebaseData";

export default function ManageMedication() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields (MM1-MM4 require these be populated if data exists)
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Fetch existing medication data (using mock helper for now)
    const med = getMockMedicineById(id || "mock1");
    if (med) {
      setName(med.name || "");
      setDosage(med.dosage || "");
      setReminderTime(med.reminderTime || "");
      setNotes(med.notes || "");
      setImageUrl(med.imageUrl || null);
    }
  }, [id]);

  function handleDelete() {
    // For now remove action is simulated — navigate back to dashboard
    // In production this would call a Firestore delete function
    console.log("Delete medication", id);
    navigate("/dashboard");
  }

  function handleSave() {
    // Simple save simulation — in real app call update API
    console.log("Save medication", { id, name, dosage, reminderTime, notes });
    navigate("/dashboard");
  }

  return (
    <div style={{ fontFamily: "inherit", minHeight: "100vh" }}>

      <div style={{ maxWidth: 360, margin: "28px auto", padding: 16 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          style={{ color: "#4B2E83", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8 }}
        >
          ← Manage Medication
        </button>

        <div style={{ background: "#f3eef8", borderRadius: 14, padding: 16, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={imageUrl || "https://via.placeholder.com/72"} alt="med" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 800, color: "#4B2E83", fontSize: 18 }}>{name || "Medication"}</div>
              <div style={{ color: "#6b5b8a", marginTop: 6 }}>{dosage}</div>
            </div>
          </div>

          <div style={{ marginTop: 14, color: "#4B2E83", fontWeight: 600 }}>Edit Medication</div>

          <div style={{ marginTop: 12, textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 6, color: "#6b5b8a" }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }} />

            <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Dose (mg)</label>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }} />

            <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Time</label>
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }} />

            <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Additional Note</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee", minHeight: 84 }} />

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={handleSave} style={{ flex: 1, background: "#4B2E83", color: "#fff", border: "none", padding: 12, borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>Save</button>
              <button onClick={handleDelete} style={{ flex: 1, background: "#fff", color: "#4B2E83", border: "2px solid #4B2E83", padding: 12, borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>DELETE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
