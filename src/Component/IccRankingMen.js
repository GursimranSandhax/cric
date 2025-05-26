import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_HOST = "cricbuzz-cricket.p.rapidapi.com";
const API_KEY = "a853eff943mshfb22a89c242446dp135c9ejsn64047c6afc1e";

export default function IccRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("test"); // test, odi, t20
  const [type, setType] = useState("batsmen"); // batsmen, bowlers, allrounders
  const navigate = useNavigate();

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${API_HOST}/stats/v1/rankings/${type}`,
        {
          params: { formatType: format },
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      setRankings(response.data.rank || []);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [format, type]);

  return (
    <div style={{ padding: 20 }}>
      <h2>ICC {format.toUpperCase()} {type.charAt(0).toUpperCase() + type.slice(1)} Rankings</h2>

      {/* Format Buttons */}
      <div className="tab-bar">
        <button onClick={() => setFormat("test")}>Test</button>
        <button onClick={() => setFormat("odi")}>ODI</button>
        <button onClick={() => setFormat("t20")}>T20</button>
      </div>

      {/* Type Buttons */}
      <div className="tab-bar">
        <button onClick={() => setType("batsmen")}>Batsmen</button>
        <button onClick={() => setType("bowlers")}>Bowlers</button>
        <button onClick={() => setType("allrounders")}>All-Rounders</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, idx) => (
              <tr key={idx}>
                <td>{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="bottom-nav">
        <Link to="/"><button>Home</button></Link>
        <Link to="/matches"><button className="active">Matches</button></Link>
          <Link to="/friends"><button>Chatting</button></Link>
        <Link to="/more"><button>More</button></Link>
      </div>
    </div>
  );
}
