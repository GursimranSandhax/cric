// src/Component/Chat/ChatPage.js
import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import ChatBubble from "./ChatBubble";

function ChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const friend = location.state?.friend;

  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  // ✅ Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/"); // redirect to home if not signed in
    });
    return unsubscribe;
  }, [navigate]);

  // ✅ Listen for new messages
  useEffect(() => {
    const messagesRef = collection(firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [chatId]);

  // ✅ Auto-scroll
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const { uid, photoURL } = user;
    const messagesRef = collection(firestore, `chats/${chatId}/messages`);

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <img src={friend?.photoURL} alt="avatar" className="friend-avatar" />
        <h3>{friend?.displayName}</h3>
      </header>

      <main className="chat-body">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} currentUid={auth.currentUser?.uid} />
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
      
      <div className="bottom-nav">
              <Link to="/"><button>Home</button></Link>
              <Link to="/matches"><button className="active">Matches</button></Link>
                <Link to="/friends"><button>Chatting</button></Link>
              <Link to="/more"><button>More</button></Link>
            </div>
    </div>
  );
}

export default ChatPage;
