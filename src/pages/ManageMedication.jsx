import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getMedicationById, updateMedication, deleteMedication } from "../services/firebaseData";

export default function ManageMedication() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields (MM1-MM4 require these be populated if data exists)
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Fetch existing medication data from Firestore
    async function loadMedication() {
      if (!id) {
        setError("No medication ID provided.");
        setLoading(false);
        return;
      }

      try {
        const med = await getMedicationById(id);
        if (med) {
          setName(med.name || "");
          setDosage(med.dosage || "");
          setReminderTime(med.reminderTime || "");
          setNotes(med.notes || "");
          setImageUrl(med.imageUrl || null);
        }
        setError("");
      } catch (err) {
        console.error("Failed to load medication:", err);
        setError(err.message || "Failed to load medication.");
      } finally {
        setLoading(false);
      }
    }

    loadMedication();
  }, [id]);

  async function handleDelete() {
    // Open confirmation UI (MM6)
    setShowConfirm(true);
  }

  async function handleConfirmDelete() {
    setError("");
    setDeleting(true);
    try {
      if (!id) throw new Error("No medication ID to delete.");
      await deleteMedication(id);
      // On success, navigate back to cabinet (MM7)
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting medication:", err);
      setError(err.message || "Failed to delete medication.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      if (!id) {
        throw new Error("No medication ID to update.");
      }

      // MM5: Update the medication document in Firestore
      // Only include fields with actual values (Firestore rejects undefined)
      const updates = {};
      if (name.trim()) updates.name = name.trim();
      if (dosage.trim()) updates.dosage = dosage.trim();
      if (reminderTime) updates.reminderTime = reminderTime;
      if (notes.trim()) updates.notes = notes.trim();

      await updateMedication(id, updates);

      // Show success message then navigate
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // 2 second delay to show success message
    } catch (err) {
      console.error("Error saving medication:", err);
      setError(err.message || "Failed to save medication.");
      setSaving(false);
    }
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

        {/* Success message */}
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, color: "#166534", padding: 12, marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
            ✓ Medication updated successfully!
          </div>
        )}

        {/* Error display */}
        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #f5c0c0", borderRadius: 8, color: "#c0392b", padding: 12, marginBottom: 12, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#6b5b8a" }}>Loading medication...</p>
          </div>
        ) : (
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
                {!showConfirm ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{ flex: 1, background: "#4B2E83", color: "#fff", border: "none", padding: 12, borderRadius: 10, cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, opacity: saving ? 0.6 : 1 }}
                    >
                      {saving ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={saving}
                      style={{ flex: 1, background: "#fff", color: "#4B2E83", border: "2px solid #4B2E83", padding: 12, borderRadius: 10, cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, opacity: saving ? 0.6 : 1 }}
                    >
                      DELETE
                    </button>
                  </>
                ) : (
                  <div style={{ width: "100%" }}>
                    <div style={{ background: "#fff7ed", border: "1px solid #f5c19e", padding: 10, borderRadius: 8, color: "#9a3412", fontWeight: 700, marginBottom: 8 }}>
                      Warning: Deleting this medication cannot be undone. Confirm delete?
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={handleConfirmDelete}
                        disabled={deleting || saving}
                        style={{ flex: 1, background: "#9a1f60", color: "#fff", border: "none", padding: 12, borderRadius: 10, cursor: deleting ? "not-allowed" : "pointer", fontWeight: 700 }}
                      >
                        {deleting ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        disabled={deleting}
                        style={{ flex: 1, background: "#fff", color: "#4B2E83", border: "2px solid #4B2E83", padding: 12, borderRadius: 10, cursor: deleting ? "not-allowed" : "pointer", fontWeight: 700 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
