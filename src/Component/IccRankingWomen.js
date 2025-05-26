  import React, { useEffect, useState } from "react";
import axios from "axios";

const API_HOST = "cricbuzz-cricket.p.rapidapi.com";
const API_KEY = "a853eff943mshfb22a89c242446dp135c9ejsn64047c6afc1e";

export default function IccRankingWomenRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("test"); // test, odi, t20
  const [type, setType] = useState("batsmen"); // batsmen, bowlers, allrounders

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${API_HOST}/stats/v1/rankings/${type}`,
        {
          params: {
            formatType: format,
            gender: "female", // <-- Add this param for women's rankings (if supported)
          },
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      setRankings(response.data.rank || []);
    } catch (error) {
      console.error("Error fetching women's rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [format, type]);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Women's ICC {format.toUpperCase()}{" "}
        {type.charAt(0).toUpperCase() + type.slice(1)} Rankings
      </h2>

      {/* Format Buttons */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setFormat("test")}>Test</button>
        <button onClick={() => setFormat("odi")}>ODI</button>
        <button onClick={() => setFormat("t20")}>T20</button>
      </div>

      {/* Type Buttons */}
      <div style={{ marginBottom: 20 }}>
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
    </div>
  );
}
