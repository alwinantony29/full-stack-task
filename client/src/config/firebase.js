import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pdfextractor-ea23f.firebaseapp.com",
  projectId: "pdfextractor-ea23f",
  storageBucket: "pdfextractor-ea23f.appspot.com",
  messagingSenderId: "931616991508",
  appId: "1:931616991508:web:d485726656311e4704ba01",
  measurementId: "G-TB6CPVPDS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

export {app,auth,provider}