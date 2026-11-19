import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYUJSgOtyo3OPdqbYLm8rE-lr0icXSVKk",
  authDomain: "csc-245-project-v2.firebaseapp.com",
  projectId: "csc-245-project-v2",
  storageBucket: "csc-245-project-v2.firebasestorage.app",
  messagingSenderId: "227393401847",
  appId: "1:227393401847:web:a28d68a5e1d40e190834f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// Connect to emulators if running locally
if (window.location.hostname === "localhost") {
  console.log("Development mode: Connecting to local Firebase emulators...");
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099');
} else {
  console.log("Production mode: Connecting to live Firebase services.");
}

export { app, db, functions, auth, googleProvider };
