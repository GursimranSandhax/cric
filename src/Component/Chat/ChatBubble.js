import React from "react";
import "./ChatBubble.css";

function ChatBubble({ message, currentUid }) {
  const isSent = message.uid === currentUid;
  const bubbleClass = isSent ? "sent" : "received";

  return (
    <div className={`chat-bubble ${bubbleClass}`}>
      <img src={message.photoURL} alt="avatar" className="avatar" />
      <div className="message-content">
        <p className="message-text">{message.text}</p>
        <span className="timestamp">
          {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default ChatBubble;
