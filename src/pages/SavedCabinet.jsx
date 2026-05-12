import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SavedCabinet() {
  const location = useLocation();
  const successMessage = location.state?.authSuccessMessage;
  const [visibleMessage, setVisibleMessage] = useState(successMessage ?? "");

  useEffect(() => {
    setVisibleMessage(successMessage ?? "");

    if (!successMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setVisibleMessage("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <h1>Saved Medicine Cabinet</h1>
        {visibleMessage ? (
          <p className="dashboard-success" role="status">
            {visibleMessage}
          </p>
        ) : null}
        <p>No medications added yet.</p>
      </section>
    </main>
  );
}
