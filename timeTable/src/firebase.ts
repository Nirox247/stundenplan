import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7drnM8-cB5eJZWyXDXbjcCTSeSOqhVuQ",
  authDomain: "fsg-stundenplan.firebaseapp.com",
  projectId: "fsg-stundenplan",
  storageBucket: "fsg-stundenplan.firebasestorage.app",
  messagingSenderId: "243965097168",
  appId: "1:243965097168:web:28288253ae8f55b751dad5",
  measurementId: "G-9FBQNL8R6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, auth, db, analytics, firestore };