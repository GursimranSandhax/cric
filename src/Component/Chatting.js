import React, { useRef, useState, useEffect } from "react";
import {
  initializeApp
} from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  // Your firebase config here
    apiKey: "AIzaSyDATw08RUJIZiM1PcEQBSjIMBEhPeUHrBk",
  authDomain: "crichatting.firebaseapp.com",
  projectId: "crichatting",
  storageBucket: "crichatting.firebasestorage.app",
  messagingSenderId: "770329807457",
  appId: "1:770329807457:web:3e10de9063f0498b99b820"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

function Chat() {
  const dummy = useRef();

  const messagesRef = collection(firestore, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const [user, setUser] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const signOutUser = () => {
    signOut(auth);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue) return;

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!user) {
    // Show sign-in button if user not signed in
    return (
      <div className="sign-in-container">
        <button className="sign-in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <p>Please sign in to join the chat.</p>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <header>
        <h2>Chat Room</h2>
        <button onClick={signOutUser}>Sign Out</button>
      </header>

      <main>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} currentUid={user.uid} />
          ))}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something nice"
        />
        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </div>
  );
}

function ChatMessage({ message, currentUid }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === currentUid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL ||
          "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt="avatar"
      />
      <p>{text}</p>
    </div>
  );
}

export default Chat;
