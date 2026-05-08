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
