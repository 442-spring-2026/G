import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { upsertUserProfile, signIn } from "../services/authService";

function getGoogleAuthErrorMessage(error) {
  const errorCode = error?.code;

  if (errorCode === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled in Firebase Authentication yet.";
  }

  if (errorCode === "auth/unauthorized-domain") {
    return "This domain is not authorized for Google sign-in in Firebase.";
  }

  if (errorCode === "auth/popup-blocked") {
    return "Google sign-in popup was blocked. Allow popups and try again.";
  }

  if (errorCode === "auth/popup-closed-by-user") {
    return "Google sign-in was canceled before completion.";
  }

  if (errorCode === "auth/cancelled-popup-request") {
    return "A sign-in popup is already open. Complete that popup and try again.";
  }

  if (errorCode === "auth/invalid-api-key") {
    return "Firebase API key is invalid. Check VITE_FIREBASE_API_KEY in your .env file.";
  }

  if (errorCode === "auth/app-not-authorized") {
    return "This app is not authorized for Firebase Authentication. Check your Firebase project and OAuth setup.";
  }

  if (errorCode === "auth/configuration-not-found") {
    return "Google sign-in is not configured in Firebase. Enable Google in Authentication > Sign-in method.";
  }

  if (errorCode === "auth/network-request-failed") {
    return "Network error during Google sign-in. Check your connection and try again.";
  }

  const fallbackMessage =
    typeof error?.message === "string"
      ? error.message
          .replace(/^Firebase:\s*/i, "")
          .replace(/\s*\(auth\/[a-z-]+\)\.?$/i, "")
          .trim()
      : "";

  return fallbackMessage
    ? `Google sign-in failed: ${fallbackMessage}`
    : "Google sign-in failed. Please try again.";
}

function getEmailAuthErrorMessage(errorCode, isCreatingAccount) {
  if (errorCode === "auth/weak-password") {
    return "Password must be at least 6 characters.";
  }

  if (errorCode === "auth/wrong-password") {
    return "Incorrect password. Please try again.";
  }

  if (errorCode === "auth/user-not-found" || errorCode === "auth/invalid-email") {
    return "Incorrect email or password.";
  }

  if (errorCode === "auth/email-already-in-use") {
    return "That email already has an account. Log in instead.";
  }

  return isCreatingAccount
    ? "Account creation failed. Please try again."
    : "Log in failed. Please try again.";
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    try {
      const credential = await signInWithPopup(auth, googleProvider);

      try {
        await upsertUserProfile(credential.user);
      } catch (profileError) {
        console.error("Signed in with Google, but user profile save failed:", profileError);
      }

      navigate("/addmedicinepage", {
        replace: true,
        state: { authSuccessMessage: "Signed in with Google successfully." },
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setErrorMessage(getGoogleAuthErrorMessage(error));
    }
  };

  const handleEmailPasswordSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      const credential = await signIn(trimmedEmail, password);
      await upsertUserProfile(credential.user);
      navigate("/addmedicinepage", {
        replace: true,
        state: { authSuccessMessage: "Logged in successfully." },
      });
    } catch (error) {
      console.error("Email/password auth failed:", error);
      setErrorMessage(getEmailAuthErrorMessage(error.code, false));
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">Log in</h1>
        <p className="auth-subtitle">Track your medications in one place.</p>

        <form onSubmit={handleEmailPasswordSubmit} className="auth-form" noValidate>
          {/* Name is collected on the dedicated signup page */}

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

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="auth-link-button"
          >
            Forgot Password?
          </button>

          <button type="submit" className="primary-button">Log in</button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="secondary-button"
        >
          Create new account
        </button>

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
