// Firebase Client SDK - Safe initialization with fallback
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ Replace these values with your Firebase Web App config from:
// Firebase Console → Project Settings → General → Your Apps → Web App → SDK Setup
const firebaseConfig = {
  apiKey: "AIzaSyD-placeholder-replace-with-real-key",
  authDomain: "kodeinx.firebaseapp.com",
  projectId: "kodeinx",
  storageBucket: "kodeinx.appspot.com",
  messagingSenderId: "107238755324112861238",
  appId: "1:107238755324112861238:web:placeholder"
};

let db = null;
let firebaseApp = null;

try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
} catch (e) {
  console.warn("[Firebase] Init failed, running in offline mode:", e.message);
}

export { db };
export default firebaseApp;
