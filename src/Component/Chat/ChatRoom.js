// src/Component/Chat/ChatRoom.js
import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate} from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import "./Chatpage.css"
import ChatBubble from './ChatBubble';

function ChatRoom() {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const friend = location.state?.friend;

  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  // ✅ Redirect if not authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/"); // send to home/login if not signed in
    });
    return unsubscribe;
  }, [navigate]);

  // ✅ Fetch chat messages
  useEffect(() => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [chatId]);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const { uid, photoURL } = user;
    const messagesRef = collection(db, `chats/${chatId}/messages`);

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
       <div className="chat-header-content">
    <img src={friend?.photoURL} alt="avatar" className="friend-avatar" />
    <h3>{friend?.displayName}</h3>
  </div>
  <button onClick={() => navigate(-1)} className="back-button">🔙</button>
</header>
      <main className="chat-messages">
        {messages.map((msg, index) => (
  <ChatBubble key={index} message={msg} currentUid={auth.currentUser?.uid} />
))}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" disabled={!formValue}>📤</button>
        
      </form>
      

    </div>
    
  );
}

function ChatMessage({ message, currentUid }) {
  const { text, uid, photoURL, createdAt } = message;
  const messageClass = uid === currentUid ? "sent" : "received";
  const time = createdAt?.toDate
    ? createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || "https://via.placeholder.com/40"} alt="avatar" />
      <div className="message-content">
        <p>{text}</p>
        <span className="timestamp">{time}</span>
      </div>
    </div>
  );
}


export default ChatRoom;
