import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='16' fill='%234B2E83'/%3E%3Cellipse cx='60' cy='52' rx='22' ry='10' fill='%23B7A57A' opacity='.9'/%3E%3Crect x='38' y='52' width='44' height='28' rx='6' fill='%23B7A57A' opacity='.9'/%3E%3Ccircle cx='60' cy='52' r='8' fill='%234B2E83'/%3E%3Ccircle cx='60' cy='52' r='4' fill='%23B7A57A'/%3E%3C/svg%3E";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f3ff 0%, #faf9f0 60%, #f0ece0 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    paddingBottom: "60px",
  },
  header: {
    background: "linear-gradient(90deg, #4B2E83 0%, #3a2266 100%)",
    padding: "28px 32px 24px",
    boxShadow: "0 4px 24px rgba(75,46,131,0.18)",
    borderBottom: "4px solid #B7A57A",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0,
  },
  headerSubtitle: {
    color: "#B7A57A",
    fontSize: "0.95rem",
    marginTop: "6px",
    fontStyle: "italic",
  },
  signOutBtn: {
    background: "rgba(183,165,122,0.15)",
    border: "1px solid #B7A57A",
    borderRadius: "8px",
    color: "#B7A57A",
    padding: "8px 18px",
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  container: {
    maxWidth: "960px",
    margin: "40px auto",
    padding: "0 20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "28px",
  },
  addBtn: {
    background: "linear-gradient(135deg, #4B2E83 0%, #3a2266 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(75,46,131,0.30)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(75,46,131,0.09)",
    border: "1px solid rgba(183,165,122,0.25)",
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
  },
  cardBody: {
    padding: "16px",
  },
  cardName: {
    margin: "0 0 6px",
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2d1f4a",
  },
  cardDosage: {
    margin: "0 0 4px",
    fontSize: "0.85rem",
    color: "#4B2E83",
  },
  cardMeta: {
    margin: "0 0 4px",
    fontSize: "0.8rem",
    color: "#8a7a6a",
  },
  cardNotes: {
    margin: "8px 0 0",
    fontSize: "0.78rem",
    color: "#8a7a6a",
    fontStyle: "italic",
    borderTop: "1px solid #f0ece0",
    paddingTop: "8px",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#8a7a6a",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #f5c0c0",
    borderRadius: "10px",
    color: "#c0392b",
    padding: "14px 18px",
    fontSize: "0.88rem",
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedications() {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const q = query(
          collection(db, "medications"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const meds = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
        setMedications(meds);
      } catch (err) {
        console.error("Failed to load medications:", err);
        setError("Failed to load medications. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchMedications();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>💊 My Cabinet</h1>
          <p style={styles.headerSubtitle}>MediTrack · Virtual Medication Cabinet</p>
        </div>
        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.topBar}>
          <button style={styles.addBtn} onClick={() => navigate("/addmedicinepage")}>
            + Add Medication
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#4B2E83", fontSize: "1.1rem" }}>Loading…</p>
        ) : error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : medications.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💊</div>
            <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Your cabinet is empty.</p>
            <p style={{ fontSize: "0.9rem" }}>Add your first medication to get started.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {medications.map((med) => (
              <div key={med.id} style={styles.card}>
                <img
                  src={med.imagePreview || PLACEHOLDER_IMAGE}
                  alt={med.name}
                  style={styles.cardImg}
                />
                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{med.name}</h3>
                  <p style={styles.cardDosage}>{med.dosage}</p>
                  <p style={styles.cardMeta}>⏰ {med.reminderTime}</p>
                  {med.expirationDate && (
                    <p style={styles.cardMeta}>📅 Expires {med.expirationDate}</p>
                  )}
                  {med.notes && (
                    <p style={styles.cardNotes}>{med.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
