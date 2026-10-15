// Firebase Client SDK Configuration
// Project: kodeinx (Firebase Firestore)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyPlaceholderKeyReplaceWithRealOne",
  authDomain: "kodeinx.firebaseapp.com",
  projectId: "kodeinx",
  storageBucket: "kodeinx.appspot.com",
  messagingSenderId: "107238755324112861238",
  appId: "1:107238755324112861238:web:kodeinx"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export default firebaseApp;
