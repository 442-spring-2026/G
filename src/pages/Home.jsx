// ─── Inline styles (no external CSS required) ────────────────────────────────
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f3ff 0%, #faf9f0 60%, #f0ece0 100%)",
    fontFamily: "inherit",
    paddingBottom: "60px",
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
    cursor: "pointer",
    display: "block",
    width: "100%",
    background: "none",
    borderLeft: "none",
    borderRight: "none",
    borderTop: "none",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "background-color 0.2s, padding-left 0.2s",
  },
  cardSectionLast: {
    padding: "32px 36px",
    cursor: "pointer",
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "background-color 0.2s, padding-left 0.2s",
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
    margin: "0 0 20px 0",
  },
  sectionLabelLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, rgba(75,46,131,0.2), transparent)",
  },
  navigationHint: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#B7A57A",
    marginTop: "12px",
  }
};

const missedDoseGuide = [
  "Take the missed dose as soon as you remember unless it is almost time for your next scheduled dose.",
  "Do not take two doses at the same time unless a pharmacist, doctor, or the medication label specifically says to do so.",
  "If you are unsure what to do, contact your pharmacist or prescribing clinician before taking more medicine.",
];

export default function Home() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);


  const getSectionStyle = (baseStyle, index) => ({
    ...baseStyle,
    backgroundColor: hoveredIndex === index ? "#fdfbfa" : "transparent",
    paddingLeft: hoveredIndex === index ? "42px" : "36px"
  });

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MediTrack</h1>
        <p style={styles.headerSubtitle}>Virtual Medication Cabinet</p>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>

          <section style={{ padding: "32px 36px", borderBottom: "1px solid #f0ece0", background: "linear-gradient(135deg, #f8f5ff, #fffaf0)" }}>
            <h2 style={styles.sectionLabel}>Missed Dose Recovery Guide <span style={styles.sectionLabelLine} /></h2>
            <p style={{ margin: "0 0 14px", color: "#1f2937" }}>
              If you miss a dose, use this quick guide before taking anything extra.
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#1f2937", lineHeight: 1.6 }}>
              {missedDoseGuide.map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
          </section>

          <button 
            type="button"
            style={getSectionStyle(styles.cardSection, 0)}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate("/addmedicinepage")}
            aria-label="Navigate to Add Medicine page"
          >
            <h2 style={styles.sectionLabel}>Add Medicine <span style={styles.sectionLabelLine}/></h2>
            <p style={{ margin: 0, color: "#1f2937" }}>Through the Add Medicine feature, you can easily add new medications to your profile. Enter details like the medicine name, dosage, and schedule to keep track of what you need to take.</p>
            <span style={styles.navigationHint}>Go to Add Medicine →</span>
          </button>

          <button 
            type="button"
            style={getSectionStyle(styles.cardSection, 1)}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate("/dashboard")}
            aria-label="Navigate to Saved Medication Cabinet dashboard"
          >
            <h2 style={styles.sectionLabel}>Saved Medication Cabinet <span style={styles.sectionLabelLine}/></h2>
            <p style={{ margin: 0, color: "#1f2937" }}>You can view all your saved medications in one place. Your medication cabinet keeps a record of everything you have added so you can quickly reference your prescriptions and dosages.</p>
            <span style={styles.navigationHint}>Go to Cabinet Dashboard →</span>
          </button>

          <button 
            type="button"
            style={getSectionStyle(styles.cardSection, 2)}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate("/dashboard")}
            aria-label="Navigate to medication dashboard to manage your list"
          >
            <h2 style={styles.sectionLabel}>Medication Management <span style={styles.sectionLabelLine}/></h2>
            <p style={{ margin: 0, color: "#1f2937" }}>The medication management feature allows you to edit or remove saved medications from your profile. You can update details like the medicine name, dosage, and schedule to keep your medication information up to date.</p>
            <span style={styles.navigationHint}>Go to Management Dashboard →</span>
          </button>

          <button 
            type="button"
            style={getSectionStyle(styles.cardSectionLast, 3)}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate("/reminders")}
            aria-label="Navigate to Reminders and Notifications log"
          >
            <h2 style={styles.sectionLabel}>Reminders and Notifications <span style={styles.sectionLabelLine}/></h2>
            <p style={{ margin: 0, color: "#1f2937" }}>The reminders and notifications feature helps remind you when it is time to take your medication. Based on your saved schedule, you will receive reminders and can mark whether your medication has been taken.</p>
            <span style={styles.navigationHint}>Go to Reminders Log →</span>
          </button>

        </div>
      </div>
    </div>
  );
}