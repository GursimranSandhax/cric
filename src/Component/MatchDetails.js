import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const MatchDetails = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        // Match Info API
        const infoRes = await fetch(
          `https://api.cricapi.com/v1/match_info?apikey=31261486-fad2-4a8b-ba94-11ddca409e12&id=${matchId}`
        );
        const infoResult = await infoRes.json();
        setMatchData(infoResult.data);

        // Scorecard API
        const scoreRes = await fetch(
          `https://api.cricapi.com/v1/match_scorecard?apikey=31261486-fad2-4a8b-ba94-11ddca409e12&id=${matchId}`
        );
        const scoreResult = await scoreRes.json();
        setScorecard(scoreResult.data);
      } catch (err) {
        console.error("Failed to fetch match details or scorecard:", err);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (!matchData) return <p>Loading match details...</p>;

  return (
    <div className="match-details-container">
      <h2>{matchData.name}</h2>
      <p><strong>Match Type:</strong> {matchData.matchType?.toUpperCase()}</p>
      <p><strong>Venue:</strong> {matchData.venue}</p>
      <p><strong>Date:</strong> {matchData.date}</p>
      <p><strong>Status:</strong> {matchData.status}</p>
      <p><strong>Toss Winner:</strong> {matchData.tossWinner} chose to {matchData.tossChoice}</p>
      <p><strong>Match Winner:</strong> {matchData.matchWinner}</p>

      {/* Basic Score */}
      {matchData.score && matchData.score.length > 0 && (
        <div>
          <h3>Scoreboard</h3>
          {matchData.score.map((inning, index) => (
            <div key={index} className="inning">
              <h4>{inning.inning}</h4>
              <p>Runs: {inning.r}, Wickets: {inning.w}, Overs: {inning.o}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Scorecard */}
      {scorecard && scorecard.scorecard && (
        <div className="scorecard-section">
          <h3>Scorecard Details</h3>
          {scorecard.scorecard.map((inning, idx) => (
            <div key={idx} className="inning-detail">
              <h4>{inning.inning}</h4>

              {/* Batsmen */}
              <h5>Batsmen</h5>
              <ul>
                {inning.batsman.map((batsman, i) => (
                  <li key={i}>
                    {batsman.name} - {batsman.r} runs, {batsman.b} balls
                  </li>
                ))}
              </ul>

              {/* Bowlers */}
              <h5>Bowlers</h5>
              <ul>
                {inning.bowlers.map((bowler, i) => (
                  <li key={i}>
                    {bowler.name} - {bowler.w} wickets, {bowler.o} overs
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="bottom-nav">
        <Link to="/"><button>Home</button></Link>
        <Link to="/matches"><button className="active">Matches</button></Link>
        <Link to="/friends"><button>Chatting</button></Link>
        <Link to="/more"><button>More</button></Link>
      </div>
    </div>
  );
};

export default MatchDetails;
