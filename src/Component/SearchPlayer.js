import React, { useState } from "react";
import axios from "axios";

const SearchPlayer = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`,
        {
          params: { plrN: query },
          headers: {
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
            'x-rapidapi-key': 'a853eff943mshfb22a89c242446dp135c9ejsn64047c6afc1e'
          }
        }
      );
      setSearchResults(response.data.player);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const getPlayerInfo = async (playerId) => {
    try {
      const response = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`,
        {
          headers: {
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
            'x-rapidapi-key': 'a853eff943mshfb22a89c242446dp135c9ejsn64047c6afc1e'
          }
        }
      );
      setSelectedPlayer(response.data);
    } catch (error) {
      console.error("Player info error:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Player Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: 20 }}>
        {searchResults.map((player) => (
          <div key={player.id} onClick={() => getPlayerInfo(player.id)} style={{ cursor: "pointer", marginBottom: 10 }}>
            {player.name}
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div style={{ marginTop: 40, borderTop: "1px solid #ccc", paddingTop: 20 }}>
          <h2>{selectedPlayer.name} ({selectedPlayer.nickName})</h2>
          
          <p><strong>Date of Birth:</strong> {selectedPlayer.DoB}</p>
          <p><strong>Batting Style:</strong> {selectedPlayer.bat}</p>
          <p><strong>Bowling Style:</strong> {selectedPlayer.bowl}</p>
          <p><strong>Role:</strong> {selectedPlayer.role}</p>
          <p><strong>Birth Place:</strong> {selectedPlayer.birthPlace}</p>
          <p><strong>International Team:</strong> {selectedPlayer.intlTeam}</p>
          <p><strong>Teams:</strong> {selectedPlayer.teams}</p>
          <p><strong>Height:</strong> {selectedPlayer.height}</p>
          {selectedPlayer.rankings && selectedPlayer.rankings.bat && (
            <div>
              <h3>Rankings - Batting:</h3>
              <p><strong>Test Rank:</strong> {selectedPlayer.rankings.bat.testRank}</p>
              <p><strong>Test Best Rank:</strong> {selectedPlayer.rankings.bat.testBestRank}</p>
              <p><strong>ODI Best Rank:</strong> {selectedPlayer.rankings.bat.odiBestRank}</p>
              <p><strong>T20 Best Rank:</strong> {selectedPlayer.rankings.bat.t20BestRank}</p>
            </div>
          )}
          {selectedPlayer.appIndex && (
            <p><strong>Profile Link:</strong> <a href={selectedPlayer.appIndex.webURL} target="_blank" rel="noopener noreferrer">{selectedPlayer.appIndex.seoTitle}</a></p>
          )}
          <div>
            <h3>Bio:</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedPlayer.bio }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPlayer;
