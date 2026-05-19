import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, upsertUserProfile } from "../services/firebaseData";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      const credential = await signUp(trimmedEmail, password);
      await upsertUserProfile(credential.user, {
        displayName: trimmedName,
        name: trimmedName,
      });

      navigate("/addmedicinepage", {
        replace: true,
        state: { authSuccessMessage: "Account created and signed in successfully." },
      });
    } catch (error) {
      console.error("Sign up failed:", error);
      const code = error?.code;
      if (code === "auth/email-already-in-use") {
        setErrorMessage("That email already has an account. Log in instead.");
      } else if (code === "auth/weak-password") {
        setErrorMessage("Password must be at least 6 characters.");
      } else {
        setErrorMessage("Account creation failed. Please try again.");
      }
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-title">
        <h1 id="signup-title">Sign Up</h1>
        <p className="auth-subtitle">Track your medications in one place.</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />

          <button type="submit" className="primary-button">Sign Up</button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="secondary-button"
        >
          Back to log in
        </button>

        {errorMessage ? (
          <p className="auth-error" role="alert">{errorMessage}</p>
        ) : null}
      </section>
    </main>
  );
}

export default SignupPage;
