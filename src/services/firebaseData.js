import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";

export async function upsertUserProfile(user, additionalFields = {}) {
  if (!user?.uid) {
    throw new Error("A valid Firebase user is required.");
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      lastLoginAt: serverTimestamp(),
      ...additionalFields,
    },
    { merge: true }
  );
}

// Sign in helper using Firebase Auth. Returns the user credential on success.
export async function signIn(email, password) {
  if (!email || !password) {
    const err = new Error("Email and password are required.");
    err.code = "auth/missing-credentials";
    throw err;
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential;
}

export async function signUp(email, password) {
  if (!email || !password) {
    const err = new Error("Email and password are required.");
    err.code = "auth/missing-credentials";
    throw err;
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential;
}

// --- Mock medicine data helper (for local testing / UI development) ---
// Returns a medicine object shaped like what the UI expects.
export function getMockMedicineById(id) {
  // single hard-coded sample for testing; expand as needed
  const sample = {
    id: "mock1",
    name: "Eliquis",
    dosage: "1 Tablet (5mg)",
    reminderTime: "09:00",
    notes: "Take with food. Avoid grapefruit.",
    imageUrl:
      "https://images.unsplash.com/photo-1580281657521-6b9d4a1d6a6b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e",
    // summary shown under the title in the design
    doseSummary: "1 Tablet (5mg)",
  };

  if (!id) return null;
  if (id === sample.id) return sample;
  // fallback: return sample for any id to simplify dev/testing
  return sample;
}
