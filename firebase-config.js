// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKTzQmFE8nU4qpw8V-R6suAZSIPaMN-bg",
  authDomain: "gto-shark.firebaseapp.com",
  projectId: "gto-shark",
  storageBucket: "gto-shark.firebasestorage.app",
  messagingSenderId: "1093311477198",
  appId: "1:1093311477198:web:7563cb54bef8bb48b5679f",
  measurementId: "G-RPFSQ6WM51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, orderBy, serverTimestamp };
