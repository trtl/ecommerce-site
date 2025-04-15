import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyAX4z4sTgVNeG83Z-LPRMsmOPbiPeoscL0",
  authDomain: "fitingis-website.firebaseapp.com",
  projectId: "fitingis-website",
  storageBucket: "fitingis-website.firebasestorage.app",
  messagingSenderId: "108320352989",
  appId: "1:108320352989:web:32511700d57c4d0d77c934",
  measurementId: "G-KHMLKJ2K9D"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, db, storage, analytics };

