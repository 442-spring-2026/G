// src/pages/AddMedicinePage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

// ─── Default placeholder (inline SVG as data URL) ────────────────────────────
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='16' fill='%234B2E83'/%3E%3Cellipse cx='60' cy='52' rx='22' ry='10' fill='%23B7A57A' opacity='.9'/%3E%3Crect x='38' y='52' width='44' height='28' rx='6' fill='%23B7A57A' opacity='.9'/%3E%3Ccircle cx='60' cy='52' r='8' fill='%234B2E83'/%3E%3Ccircle cx='60' cy='52' r='4' fill='%23B7A57A'/%3E%3C/svg%3E";

// ─── Inline styles (no external CSS required) ────────────────────────────────
const styles = {
  page: {
    minHeight: "calc(100vh + 96px)",
    background: "linear-gradient(135deg, #f5f3ff 0%, #faf9f0 60%, #f0ece0 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    paddingBottom: "12px",
  },
  header: {
    background: "linear-gradient(90deg, #4B2E83 0%, #3a2266 100%)",
    padding: "28px 32px 24px",
    boxShadow: "0 4px 24px rgba(75,46,131,0.18)",
    borderBottom: "4px solid #B7A57A",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: "2rem",
    fontWeight: "700",
    letterSpacing: "0.02em",
    margin: 0,
  },
  headerSubtitle: {
    color: "#B7A57A",
    fontSize: "0.95rem",
    marginTop: "6px",
    fontStyle: "italic",
    letterSpacing: "0.04em",
  },
  container: {
    maxWidth: "680px",
    margin: "40px auto",
    padding: "0 20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 8px 40px rgba(75,46,131,0.10), 0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
    border: "1px solid rgba(183,165,122,0.25)",
  },
  cardSection: {
    padding: "32px 36px",
    borderBottom: "1px solid #f0ece0",
  },
  cardSectionLast: {
    padding: "32px 36px",
  },
  sectionLabel: {
    fontSize: "0.72rem",
    fontWeight: "700",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#4B2E83",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionLabelLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, rgba(75,46,131,0.2), transparent)",
  },

  // Image upload
  imageUploadArea: {
    border: "2px dashed #B7A57A",
    borderRadius: "14px",
    padding: "28px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "linear-gradient(135deg, #faf9f5, #f5f0e8)",
    position: "relative",
  },
  imageUploadAreaHover: {
    borderColor: "#4B2E83",
    background: "linear-gradient(135deg, #f0ebfa, #e8e0f5)",
  },
  imagePreview: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "3px solid #B7A57A",
    boxShadow: "0 4px 16px rgba(75,46,131,0.15)",
    display: "block",
    margin: "0 auto 14px",
  },
  uploadIcon: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    display: "block",
  },
  uploadText: {
    color: "#4B2E83",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginBottom: "4px",
  },
  uploadSub: {
    color: "#8a7a6a",
    fontSize: "0.8rem",
  },
  changeImageBtn: {
    marginTop: "12px",
    background: "none",
    border: "1px solid #B7A57A",
    borderRadius: "20px",
    color: "#4B2E83",
    padding: "5px 16px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },

  // Form fields
  fieldGroup: {
    marginBottom: "22px",
  },
  fieldGroupRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "22px",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: "600",
    color: "#3a2266",
    marginBottom: "7px",
    letterSpacing: "0.02em",
  },
  required: {
    color: "#B7A57A",
    marginLeft: "3px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #ddd8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#2d1f4a",
    background: "#faf9ff",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    outline: "none",
  },
  inputError: {
    borderColor: "#e05050",
    background: "#fff8f8",
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #ddd8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#2d1f4a",
    background: "#faf9ff",
    fontFamily: "inherit",
    minHeight: "90px",
    resize: "vertical",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    outline: "none",
  },
  errorMsg: {
    color: "#c0392b",
    fontSize: "0.78rem",
    marginTop: "5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  // Save button
  saveBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #4B2E83 0%, #3a2266 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: "700",
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(75,46,131,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  // Global error
  globalError: {
    background: "#fff0f0",
    border: "1px solid #f5c0c0",
    borderRadius: "10px",
    color: "#c0392b",
    padding: "12px 16px",
    fontSize: "0.88rem",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

// ─── Helper: convert File → base64 data URL ──────────────────────────────────
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddMedicinePage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState(null); 

  // UI state
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hovering, setHovering] = useState(false);

  const fileInputRef = useRef(null);

  // ── Image selection ────────────────────────────────────────────────────────
  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setGlobalError("Please select a valid image file (JPG, PNG, GIF, etc.).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setGlobalError("Image must be smaller than 5 MB.");
      return;
    }
    setGlobalError("");

    try {
      const dataURL = await fileToDataURL(file);
      setImagePreview(dataURL);
    } catch {
      setGlobalError("Failed to read image. Please try again.");
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate() {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Medication name is required.";
    if (!dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!reminderTime) newErrors.reminderTime = "Reminder time is required.";

    if (expirationDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(expirationDate + "T00:00:00"); // avoid timezone shift
      if (exp < today) newErrors.expirationDate = "Date invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Save to Firestore ──────────────────────────────────────────────────────
  async function handleSave() {
    setGlobalError("");
    if (!validate()) return;

    const user = auth.currentUser;
    if (!user) {
      setGlobalError("You must be logged in to save medications.");
      return;
    }

    setSaving(true);
    try {
      const medicationData = {
        userId: user.uid,
        name: name.trim(),
        dosage: dosage.trim(),
        reminderTime,
        expirationDate: expirationDate || null,
        notes: notes.trim() || null,
        // Sprint 1: store base64 preview directly.
        // Sprint 2: swap for Firebase Storage URL.
        imagePreview: imagePreview || null,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "medications"), medicationData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Firestore save error:", err);
      setGlobalError("Failed to save medication. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Render helpers ─────────────────────────────────────────────────────────
  function InputError({ field }) {
    if (!errors[field]) return null;
    return (
      <div style={styles.errorMsg} role="alert">
        <span>⚠</span> {errors[field]}
      </div>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* ── Page Header ── */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>💊 Add Medication</h1>
        <p style={styles.headerSubtitle}>MediTrack · Virtual Medication Cabinet</p>
      </div>

      <div style={styles.container}>
        {/* Global error */}
        {globalError && (
          <div style={styles.globalError} role="alert">
            <span>❌</span> {globalError}
          </div>
        )}

        <div style={styles.card}>

          {/* ── Section 1: Image Upload ── */}
          <div style={styles.cardSection}>
            <div style={styles.sectionLabel}>
              Photo
              <div style={styles.sectionLabelLine} />
            </div>

            <div
              style={{
                ...styles.imageUploadArea,
                ...(hovering ? styles.imageUploadAreaHover : {}),
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              role={imagePreview ? undefined : "button"}
              tabIndex={imagePreview ? undefined : 0}
              aria-label={imagePreview ? "Medication image preview" : "Upload medication image"}
              onKeyDown={(e) => {
                if (!imagePreview && (e.key === "Enter" || e.key === " "))
                  fileInputRef.current?.click();
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Medication preview" style={styles.imagePreview} />
                  <p style={{ color: "#4B2E83", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>
                    Image selected ✓
                  </p>
                  <button
                    type="button"
                    style={styles.changeImageBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Change image
                  </button>
                </>
              ) : (
                <>
                  <span style={styles.uploadIcon}>📷</span>
                  <p style={styles.uploadText}>Click to upload a photo</p>
                  <p style={styles.uploadSub}>JPG, PNG, GIF · max 5 MB</p>
                  <p style={{ ...styles.uploadSub, marginTop: 8, fontStyle: "italic" }}>
                    Optional — a default icon will be used if skipped
                  </p>
                </>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
              aria-label="Upload medication image file"
            />
          </div>

          {/* ── Section 2: Medication Details ── */}
          <div style={styles.cardSection}>
            <div style={styles.sectionLabel}>
              Medication Details
              <div style={styles.sectionLabelLine} />
            </div>

            {/* Name */}
            <div style={styles.fieldGroup}>
              <label htmlFor="med-name" style={styles.label}>
                Medication Name <span style={styles.required}>*</span>
              </label>
              <input
                id="med-name"
                type="text"
                placeholder="e.g. Ibuprofen 200mg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                aria-required="true"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              <div id="name-error"><InputError field="name" /></div>
            </div>

            {/* Dosage */}
            <div style={styles.fieldGroup}>
              <label htmlFor="med-dosage" style={styles.label}>
                Dosage <span style={styles.required}>*</span>
              </label>
              <input
                id="med-dosage"
                type="text"
                placeholder="e.g. 1 tablet / 200mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                style={{ ...styles.input, ...(errors.dosage ? styles.inputError : {}) }}
                aria-required="true"
                aria-describedby={errors.dosage ? "dosage-error" : undefined}
              />
              <div id="dosage-error"><InputError field="dosage" /></div>
            </div>
          </div>

          {/* ── Section 3: Schedule ── */}
          <div style={styles.cardSection}>
            <div style={styles.sectionLabel}>
              Schedule
              <div style={styles.sectionLabelLine} />
            </div>

            <div style={styles.fieldGroupRow}>
              {/* Reminder Time */}
              <div>
                <label htmlFor="reminder-time" style={styles.label}>
                  Reminder Time <span style={styles.required}>*</span>
                </label>
                <input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{ ...styles.input, ...(errors.reminderTime ? styles.inputError : {}) }}
                  aria-required="true"
                  aria-describedby={errors.reminderTime ? "time-error" : undefined}
                />
                <div id="time-error"><InputError field="reminderTime" /></div>
              </div>

              {/* Expiration Date */}
              <div>
                <label htmlFor="exp-date" style={styles.label}>
                  Expiration Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  style={{ ...styles.input, ...(errors.expirationDate ? styles.inputError : {}) }}
                  aria-describedby={errors.expirationDate ? "exp-error" : undefined}
                />
                <div id="exp-error"><InputError field="expirationDate" /></div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Additional Notes ── */}
          <div style={styles.cardSection}>
            <div style={styles.sectionLabel}>
              Additional Notes
              <div style={styles.sectionLabelLine} />
            </div>
            <label htmlFor="med-notes" style={styles.label}>
              Notes{" "}
              <span style={{ color: "#8a7a6a", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="med-notes"
              placeholder="e.g. Take with food. Refill before June."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* ── Section 5: Save ── */}
          <div style={styles.cardSectionLast}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.saveBtn,
                ...(saving ? styles.saveBtnDisabled : {}),
              }}
              aria-busy={saving}
            >
              {saving ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
                    ⏳
                  </span>
                  Saving…
                </>
              ) : (
                <>💾 Save Medication</>
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#8a7a6a",
                fontSize: "0.78rem",
                marginTop: "14px",
              }}
            >
              Fields marked <span style={styles.required}>*</span> are required
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="time"]::-webkit-calendar-picker-indicator,
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(18%) sepia(60%) saturate(400%) hue-rotate(220deg);
          cursor: pointer;
        }
        button:hover:not(:disabled) { filter: brightness(1.08); }
      `}</style>
    </div>
  );
}