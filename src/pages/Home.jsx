// ─── Inline styles (no external CSS required) ────────────────────────────────
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
  }
};

export default function Home() {
  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MediTrack</h1>
        <p style={styles.headerSubtitle}>Virtual Medication Cabinet</p>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.cardSection}>
            <h2 style={styles.sectionLabel}>Add Medicine <span style={styles.sectionLabelLine}/></h2>
            <p>Through the Add Medicine feature, you can easily add new medications to your profile. Enter details like the medicine name, dosage, and schedule to keep track of what you need to take.</p>
          </div>

          <div style={styles.cardSection}>
            <h2 style={styles.sectionLabel}>Saved Medication Cabinet <span style={styles.sectionLabelLine}/></h2>
            <p>You can view all your saved medications in one place. Your medication cabinet keeps a record of everything you have added so you can quickly reference your prescriptions and dosages.</p>
          </div>

          <div style={styles.cardSection}>
            <h2 style={styles.sectionLabel}>Medication Management <span style={styles.sectionLabelLine}/></h2>
            <p>The medication management feature allows you to edit or remove saved medications from your profile. You can update details like the medicine name, dosage, and schedule to keep your medication information up to date.</p>
          </div>

          <div style={styles.cardSectionLast}>
            <h2 style={styles.sectionLabel}>Reminders and Notifications <span style={styles.sectionLabelLine}/></h2>
            <p>The reminders and notifications feature helps remind you when it is time to take your medication. Based on your saved schedule, you will receive reminders and can mark whether your medication has been taken.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
