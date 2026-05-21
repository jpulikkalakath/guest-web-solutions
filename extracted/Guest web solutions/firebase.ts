import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBX8AvhsQ4JKWvmyuCCBGKwMlzpYuUumHk",
  authDomain: "push-to-github.firebaseapp.com",
  projectId: "push-to-github",
  storageBucket: "push-to-github.firebasestorage.app",
  messagingSenderId: "623313072362",
  appId: "1:623313072362:web:ef560a0db847883db4a793"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Log project info for debugging
console.log("[Firebase] Project:", firebaseConfig.projectId);
console.log("[Firebase] Auth domain:", firebaseConfig.authDomain);
