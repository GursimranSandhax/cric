// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
     apiKey: "AIzaSyDATw08RUJIZiM1PcEQBSjIMBEhPeUHrBk",
  authDomain: "crichatting.firebaseapp.com",
  projectId: "crichatting",
  storageBucket: "crichatting.firebasestorage.app",
  messagingSenderId: "770329807457",
  appId: "1:770329807457:web:3e10de9063f0498b99b820"

};

const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});
const db = getFirestore(app);
export { auth, provider, db };