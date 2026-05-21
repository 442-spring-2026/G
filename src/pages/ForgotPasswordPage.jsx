import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/firebaseData";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(trimmedEmail);
      setMessage("If an account exists for that email, a password reset link has been sent.");
    } catch (error) {
      console.error("Password reset request failed:", error);

      if (error?.code === "auth/invalid-email") {
        setErrorMessage("Enter a valid email address.");
      } else if (error?.code === "auth/missing-email") {
        setErrorMessage("Email is required.");
      } else {
        setErrorMessage("Unable to send reset email right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--compact" aria-labelledby="forgot-password-title">
        <h1 id="forgot-password-title">Reset Password</h1>
        <p className="auth-subtitle">Enter the email tied to your account and we’ll send a reset link.</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            name="reset-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <button type="button" onClick={() => navigate("/login")} className="secondary-button">
          Back to log in
        </button>

        {message ? (
          <p className="auth-success" role="status">
            {message}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default ForgotPasswordPage;