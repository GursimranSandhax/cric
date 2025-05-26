import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";
const API_HOST = "cricbuzz-cricket.p.rapidapi.com";
const API_KEY = "a853eff943mshfb22a89c242446dp135c9ejsn64047c6afc1e";

const formatToId = {
  test: 1,
  odi: 2,
  t20: 3,
};

export default function IccTeamRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("test");
  const navigate = useNavigate();

  const fetchTeamRankings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${API_HOST}/stats/v1/iccstanding/team/matchtype/${formatToId[format]}`,
        {
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );

      const values = response.data.values || [];
      setRankings(values.map(item => item.value));
    } catch (error) {
      console.error("Error fetching team rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRankings();
  }, [format]);

  return (
    <div style={{ padding: 20 }}>
      <h2>ICC {format.toUpperCase()} Team Rankings</h2>

      {/* Format Buttons */}
      <div className="tab-bar">
        <button onClick={() => setFormat("test")}>Test</button>
        <button onClick={() => setFormat("odi")}>ODI</button>
        <button onClick={() => setFormat("t20")}>T20</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>PCT</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((team, idx) => (
              <tr key={idx}>
                <td>{team[0]}</td> {/* Rank */}
                <td>{team[2]}</td> {/* Team Name */}
                <td>{team[3]}%</td> {/* PCT */}
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
