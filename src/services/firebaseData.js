import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

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
