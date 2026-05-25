// Chooses between real Firebase auth and local mock auth based on VITE_USE_MOCK_AUTH
import * as mockAuth from './mockAuth';
import * as firebaseData from './firebaseData';

const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const impl = useMock ? mockAuth : firebaseData;

export const signIn = (...args) => impl.signIn(...args);
export const signUp = (...args) => impl.signUp(...args);
export const upsertUserProfile = (...args) => impl.upsertUserProfile(...args);

export default { signIn, signUp, upsertUserProfile };
