// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CricketScore from './Component/CricketScore';
import MatchDetails from './Component/MatchDetails';
import MatchesPage from './Component/matches';
import MorePage from './Component/MorePage';

import SearchPlayer from './Component/SearchPlayer';
import IccRankingMen from './Component/IccRankingMen';
import IccRankingTeams from './Component/IccRankingTeams';

import FriendList from './Component/Chat/FriendList';
import ChatRoom from './Component/Chat/ChatRoom';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CricketScore />} />
          <Route path="/match/:matchId" element={<MatchDetails />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/more" element={<MorePage />} />
          
          <Route path="/more/search-player" element={<SearchPlayer />} />
          <Route path="/more/icc-men" element={<IccRankingMen />} />
          <Route path="/more/icc-teams" element={<IccRankingTeams />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



