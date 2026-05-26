// Simple local mock auth for development/testing when VITE_USE_MOCK_AUTH=true
function makeUser(email, name) {
  return {
    uid: `mock-${btoa(email).slice(0,8)}`,
    email,
    displayName: name ?? email.split('@')[0],
  };
}

export async function signIn(email, password) {
  const mockEmail = import.meta.env.VITE_MOCK_EMAIL;
  const mockPassword = import.meta.env.VITE_MOCK_PASSWORD;

  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.code = 'auth/missing-credentials';
    throw err;
  }

  if (email === mockEmail && password === mockPassword) {
    return { user: makeUser(email) };
  }

  const err = new Error('Incorrect email or password.');
  err.code = 'auth/wrong-password';
  throw err;
}

export async function signUp(email, password) {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.code = 'auth/missing-credentials';
    throw err;
  }

  // For local testing, allow any sign-up and return a mock user
  return { user: makeUser(email) };
}

export async function upsertUserProfile(user, additionalFields = {}) {
  // no-op for mock (could be extended to persist locally)
  return { ok: true };
}

export default { signIn, signUp, upsertUserProfile };
