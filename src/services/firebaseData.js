import { doc, getDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
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

export async function requestPasswordReset(email) {
  if (!email) {
    const err = new Error("Email is required.");
    err.code = "auth/missing-email";
    throw err;
  }

  await sendPasswordResetEmail(auth, email);
}

// --- Medication management (MM5) ---
// Fetch a medication document by ID from Firestore
export async function getMedicationById(medicationId) {
  if (!medicationId) {
    throw new Error("Medication ID is required.");
  }

  try {
    const docRef = doc(db, "medications", medicationId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Medication not found.");
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (err) {
    console.error("Error fetching medication:", err);
    throw err;
  }
}

// Update a medication document in Firestore (MM5)
// Uses setDoc with merge to create document if it doesn't exist
export async function updateMedication(medicationId, updates) {
  if (!medicationId) {
    throw new Error("Medication ID is required.");
  }

  try {
    const docRef = doc(db, "medications", medicationId);
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error updating medication:", err);
    throw err;
  }
}

// Delete a medication document from Firestore (MM7)
export async function deleteMedication(medicationId) {
  if (!medicationId) {
    throw new Error("Medication ID is required.");
  }

  try {
    const docRef = doc(db, "medications", medicationId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting medication:", err);
    throw err;
  }
}
