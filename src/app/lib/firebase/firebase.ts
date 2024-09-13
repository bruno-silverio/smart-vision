import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length 
    ? initializeApp(firebaseConfig)
    : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
const resetPassword = async (email: string) => {
  const auth = getAuth();

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    alert('Failed to send password reset email. Please try again.');
  }
};

const user = auth.currentUser;
const loggedInUserId = user?.uid;
const loggedInUserName = user?.email
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, logout, resetPassword, db, storage, loggedInUserId, loggedInUserName };
