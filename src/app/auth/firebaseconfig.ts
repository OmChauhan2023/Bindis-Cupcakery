// src/app/auth/firebaseconfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD3LRdwyNbsdy2j5sRnp5hIKgtr-embtR0",
  authDomain: "bindi-s-cupcakery-c4447.firebaseapp.com",
  projectId: "bindi-s-cupcakery-c4447",
  storageBucket: "bindi-s-cupcakery-c4447.appspot.com", // ✅ Fixed incorrect storage bucket URL
  messagingSenderId: "658232088519",
  appId: "1:658232088519:web:93a23df88a47a95c4a2be2",
  measurementId: "G-KB5W08YGT9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Only initialize analytics in the browser
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
