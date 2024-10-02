import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth'; // Import getAuth to check if auth is already initialized
import AsyncStorage from '@react-native-async-storage/async-storage';

// Updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSqNF7Sx3UdzG1pUde3NQVFH5QF8XnkFU",
  authDomain: "farm-5afc3.firebaseapp.com",
  projectId: "farm-5afc3",
  storageBucket: "farm-5afc3.appspot.com",
  messagingSenderId: "1004256712695",
  appId: "1:1004256712695:web:6d7287e4e640601ca1c0f2",
  measurementId: "G-VR1KKVZ07R" // Optional
};

// Initialize Firebase app if it has not been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

// Check if Auth is already initialized
let auth;
if (getApps().length === 0) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  auth = getAuth(app); // Get the already initialized Auth instance
}

export { firestore, auth };
