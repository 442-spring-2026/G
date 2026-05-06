import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/add");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  const handleEmailPasswordSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    navigate("/add");
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">Log in</h1>
        <p className="auth-subtitle">Track your medications in one place.</p>

        <form onSubmit={handleEmailPasswordSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="primary-button">
            Log in
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="secondary-button"
        >
          Sign in with Google
        </button>

        {errorMessage ? (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default LoginPage;