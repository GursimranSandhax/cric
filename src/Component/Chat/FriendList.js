import React, { useEffect, useState } from "react";
import { auth, db, provider } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import '../Chat/fri.css';

function FriendList() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchUsers(firebaseUser.uid);
      } else {
        setFriends([]); // Clear friends list on sign-out
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUsers = async (currentUserId) => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(friend => friend.id !== currentUserId);

    setFriends(users);
  };
const handleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const signedInUser = result.user;

    // Add user to Firestore if not already present
    const userRef = doc(db, "users", signedInUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: signedInUser.uid,
        displayName: signedInUser.displayName,
        email: signedInUser.email,
        photoURL: signedInUser.photoURL,
      });
    }

  } catch (error) {
    console.error("Sign in failed:", error);
  }
};

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear local user state
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="friend-list">
        <h2>Welcome to Cricket Chat</h2>
        <button onClick={handleSignIn}>Sign In with Google</button>
      </div>
    );
  }

  return (
    <div className="friend-list">
      
     <h2>Hi, {user.displayName} 👋</h2>
      <h2>Friends List</h2>
      {friends.map(friend => (
        <div key={friend.id} onClick={() => handleChat(friend)} className="friend-item">
          <img src={friend.photoURL} alt={friend.displayName} />
          <p>{friend.displayName}</p>
        </div>
      ))}
      <button onClick={handleSignOut}>Sign Out</button>
      
<div className="bottom-nav">
        <Link to="/"><button>Home</button></Link>
        <Link to="/matches"><button className="active">Matches</button></Link>
          <Link to="/friends"><button>Chatting</button></Link>
        <Link to="/more"><button>More</button></Link>
      </div>
    </div>
  );

  function handleChat(friend) {
    const myId = user.uid;
    const friendId = friend.id;
    const chatId = myId < friendId ? `${myId}_${friendId}` : `${friendId}_${myId}`;
    navigate(`/chat/${chatId}`, { state: { friend } });
  }
}
    
export default FriendList;
