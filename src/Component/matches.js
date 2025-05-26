import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './matches.css';

const MatchesPage = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("live");
  const [genderFilter, setGenderFilter] = useState("Men");
  const [matchTypeFilter, setMatchTypeFilter] = useState("All");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          "https://api.cricapi.com/v1/cricScore?apikey=31261486-fad2-4a8b-ba94-11ddca409e12"
        );
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };
    fetchMatches();
  }, []);

  const filterByStatus = (match) => {
    const status = match.status.toLowerCase();
    if (statusFilter === "live") return status.includes("live");
    if (statusFilter === "upcoming") return status.includes("not started");
    if (statusFilter === "recent") return status.includes("won") || status.includes("draw") || status.includes("stumps") || status.includes("completed");
    return true;
  };

  const filterByType = (match) => {
    if (matchTypeFilter === "International") return match.matchType === "odi" || match.matchType === "t20";
    if (matchTypeFilter === "Domestic") return match.matchType !== "odi" && match.matchType !== "t20";
    return true;
  };

  const filteredMatches = data.filter(filterByStatus).filter(filterByType);

  return (
    <div className="main-container">

      <h2 className="title">Matches</h2>

      {/* Filters */}
      <div className="tab-bar">
        <button className={statusFilter === "live" ? "active" : ""} onClick={() => setStatusFilter("live")}>live</button>
        <button className={statusFilter === "upcoming" ? "active" : ""} onClick={() => setStatusFilter("upcoming")}>Upcoming</button>
        <button className={statusFilter === "recent" ? "active" : ""} onClick={() => setStatusFilter("recent")}>Recent</button>
      </div>

      <div className="tab-bar">
        <button className={genderFilter === "Men" ? "active" : ""} onClick={() => setGenderFilter("Men")}>Men</button>
        <button className={genderFilter === "Women" ? "active" : ""} onClick={() => setGenderFilter("Women")}>Women</button>
      </div>

      <div className="tab-bar">
        <button className={matchTypeFilter === "All" ? "active" : ""} onClick={() => setMatchTypeFilter("All")}>All</button>
        <button className={matchTypeFilter === "International" ? "active" : ""} onClick={() => setMatchTypeFilter("International")}>International</button>
        <button className={matchTypeFilter === "Domestic" ? "active" : ""} onClick={() => setMatchTypeFilter("Domestic")}>Domestic</button>
      </div>

      {/* Match Cards */}
      <div className="match-list">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match, index) => (
            <div className="match-card" key={index}>
              <h4>{match.series}</h4>
              <p>{match.matchType?.toUpperCase()}</p>
              <div className="teams">
                <div>
                  <img src={match.t1img} alt={match.t1} width={40} />
                  <p>{match.t1}</p>
                  <p>{match.t1s}</p>
                </div>
                <div>
                  <img src={match.t2img} alt={match.t2} width={40} />
                  <p>{match.t2}</p>
                  <p>{match.t2s}</p>
                </div>
              </div>
              <p className="status">Status: {match.status}</p>
              <Link to={`/match/${match.id}`}>
                              <button className="details-btn">View Details</button>
                            </Link>
            </div>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
              <Link to="/"><button>Home</button></Link>
              <Link to="/matches"><button className="active">Matches</button></Link>
                <Link to="/friends"><button>Chatting</button></Link>
              <Link to="/more"><button>More</button></Link>
            </div>
          </div>
  );
};

export default MatchesPage;
