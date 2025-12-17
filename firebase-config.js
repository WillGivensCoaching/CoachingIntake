// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, orderBy, serverTimestamp, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmDEeYeZWK4bxtiG5F-aBmOdeVxgKoMMw",
  authDomain: "will-givens-coaching.firebaseapp.com",
  projectId: "will-givens-coaching",
  storageBucket: "will-givens-coaching.firebasestorage.app",
  messagingSenderId: "614429925782",
  appId: "1:614429925782:web:f845235a21e67239253db7",
  measurementId: "G-WL4QZG0N1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, orderBy, serverTimestamp, addDoc };
