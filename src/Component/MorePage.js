import React from "react";
import { Link } from "react-router-dom";
import "./MorePage.css";          // optional styling

export default function MorePage() {
  return (
    <div className="main-container">
      <h2 className="title">More</h2>

      <div className="menu">
        
        <Link to="/more/search-player" className="menu-item">Search player</Link>
        <Link to="/more/icc-men"       className="menu-item">Icc ranking - men</Link>
        <Link to="/more/icc-teams"     className="menu-item">Icc ranking- teams</Link>
      </div>

      {/* bottom nav – highlight “More” */}
      <div className="bottom-nav">
              <Link to="/"><button>Home</button></Link>
              <Link to="/matches"><button className="active">Matches</button></Link>
                <Link to="/friends"><button>Chatting</button></Link>
              <Link to="/more"><button>More</button></Link>
            </div>
          
    </div>
  );
}
