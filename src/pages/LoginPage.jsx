import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { upsertUserProfile } from "../services/firebaseData";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await upsertUserProfile(credential.user);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  const handleEmailPasswordSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await upsertUserProfile(credential.user);
    } catch (error) {
      console.error("Email/password sign-in failed:", error);

      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Incorrect email or password.");
        return;
      }

      setErrorMessage("Log in failed. Please try again.");
    }
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
