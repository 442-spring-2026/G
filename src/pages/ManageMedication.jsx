import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getMedicationById, updateMedication, deleteMedication } from "../services/firebaseData";
import { buildDosage, formatDosage, parseDosage } from "../utils/dosage";

const DOSAGE_UNITS = ["mg", "mcg", "g", "mL", "IU", "tablet(s)", "capsule(s)", "units"];

const DEFAULT_MEDICATION_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23f3eef8'/%3E%3Cpath d='M33 38h30a7 7 0 0 1 7 7v10a13 13 0 0 1-13 13H40a13 13 0 0 1-13-13V45a7 7 0 0 1 6-7z' fill='%234B2E83'/%3E%3Crect x='28' y='34' width='40' height='9' rx='4.5' fill='%23B7A57A'/%3E%3Ccircle cx='48' cy='52' r='10' fill='%23f3eef8'/%3E%3Ccircle cx='48' cy='52' r='5' fill='%234B2E83'/%3E%3C/svg%3E";

export default function ManageMedication() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields (MM1-MM4 require these be populated if data exists)
  const [name, setName] = useState("");
  const [dosageAmount, setDosageAmount] = useState("");
  const [dosageUnit, setDosageUnit] = useState("mg");
  const [reminderTime, setReminderTime] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalMedication, setOriginalMedication] = useState(null);

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
        setImageLoadError(false);
        const med = await getMedicationById(id);
        if (med) {
          setName(med.name || "");
          const parsedDosage = parseDosage(med.dosage);
          setDosageAmount(parsedDosage.amount);
          setDosageUnit(DOSAGE_UNITS.includes(parsedDosage.unit) ? parsedDosage.unit : "mg");
          setReminderTime(med.reminderTime || "");
          setNotes(med.notes || "");
          setExpirationDate(med.expirationDate || "");
          setImageUrl(med.imageUrl || med.imagePreview || med.photoUrl || med.photoURL || null);
          setOriginalMedication({
            name: med.name || "",
            dosage: formatDosage(med.dosage),
            reminderTime: med.reminderTime || "",
            expirationDate: med.expirationDate || null,
            notes: med.notes || "",
          });
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

  const displayImageUrl = imageLoadError ? null : imageUrl;
  const currentSnapshot = {
    name: name.trim(),
    dosage: buildDosage(dosageAmount, dosageUnit),
    reminderTime,
    expirationDate: expirationDate || null,
    notes: notes.trim(),
  };
  const isDirty = !originalMedication
    ? false
    : Object.keys(currentSnapshot).some(
        (key) => currentSnapshot[key] !== originalMedication[key]
      );
  const dosageError = errors.dosage;

  function handleDosageAmountChange(event) {
    const value = event.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      setDosageAmount(value);
      if (errors.dosage) {
        setErrors((current) => ({ ...current, dosage: undefined }));
      }
    }
  }

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

      const dosageAmountTrimmed = dosageAmount.trim();
      const dosageAmountIsNumeric = /^\d+$/.test(dosageAmountTrimmed);

      if (!dosageAmountTrimmed) {
        setErrors({ dosage: "Dosage amount is required." });
        setSaving(false);
        return;
      }

      if (!dosageAmountIsNumeric) {
        setErrors({ dosage: "Dosage amount must be a whole number." });
        setSaving(false);
        return;
      }

      // Validate expiration date (if provided) is not in the past
      if (expirationDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(expirationDate + "T00:00:00");
        if (exp < today) {
          setError("Expiration date cannot be in the past.");
          setSaving(false);
          return;
        }
      }

      // MM5: Update the medication document in Firestore
      // Only include fields with actual values (Firestore rejects undefined)
      const updates = {};
      if (name.trim()) updates.name = name.trim();
      if (dosageAmountTrimmed) updates.dosage = buildDosage(dosageAmountTrimmed, dosageUnit);
      if (reminderTime) updates.reminderTime = reminderTime;
      // Always include expirationDate so clearing it sets field to null in Firestore
      updates.expirationDate = expirationDate || null;
      if (notes.trim()) updates.notes = notes.trim();

      if (!isDirty) {
        setError("No changes detected.");
        setSaving(false);
        return;
      }

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
              <div style={{ width: 72, height: 72, borderRadius: 36, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img
                  src={displayImageUrl || DEFAULT_MEDICATION_ICON}
                  alt={name ? `${name} medication` : "Medication"}
                  onError={() => setImageLoadError(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 800, color: "#4B2E83", fontSize: 18 }}>{name || "Medication"}</div>
                  <div style={{ color: "#6b5b8a", marginTop: 6 }}>{formatDosage(buildDosage(dosageAmount, dosageUnit))}</div>
              </div>
            </div>

            <div style={{ marginTop: 14, color: "#4B2E83", fontWeight: 600 }}>Edit Medication</div>

            <div style={{ marginTop: 12, textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: 6, color: "#6b5b8a" }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }} />

              <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>
                Dosage
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={dosageAmount}
                  onChange={handleDosageAmountChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="500"
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }}
                />
                <select
                  value={dosageUnit}
                  onChange={(e) => setDosageUnit(e.target.value)}
                  style={{ width: 120, padding: 10, borderRadius: 8, border: "1px solid #eee" }}
                  aria-label="Dosage unit"
                >
                  {DOSAGE_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {errors.dosage && (
                <div style={{ color: "#c0392b", marginTop: 8, fontWeight: 600 }}>{errors.dosage}</div>
              )}

              <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Time</label>
              <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }} />

              <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Expiration Date</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => { setExpirationDate(e.target.value); setError(""); }}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee" }}
                />
                <button
                  onClick={() => setExpirationDate("")}
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #eee", background: "#fff", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
              <div style={{ color: "#6b5b8a", fontSize: 13, marginTop: 6 }}>
                Clear the date to remove expiration for this medication.
              </div>

              <label style={{ display: "block", marginTop: 10, marginBottom: 6, color: "#6b5b8a" }}>Additional Note</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #eee", minHeight: 84 }} />

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {!showConfirm ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving || !!dosageError || !isDirty}
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
              {!isDirty && !saving && !showConfirm && (
                <div style={{ color: "#6b5b8a", fontSize: 13, marginTop: 10 }}>
                  Make a change to enable Update.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
