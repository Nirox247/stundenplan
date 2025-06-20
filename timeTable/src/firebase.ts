import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // ✅ alles aus firestore
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA7drnM8-cB5eJZWyXDXbjcCTSeSOqhVuQ",
  authDomain: "fsg-stundenplan.firebaseapp.com",
  projectId: "fsg-stundenplan",
  storageBucket: "fsg-stundenplan.firebasestorage.app",
  messagingSenderId: "243965097168",
  appId: "1:243965097168:web:28288253ae8f55b751dad5",
  measurementId: "G-9FBQNL8R6C",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export const getUsersFromFirestore = async () => {
  const usersCollectionRef = collection(db, "users");
  const snapshot = await getDocs(usersCollectionRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};


export { app, analytics, db, auth };
