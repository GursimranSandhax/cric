import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import circle from "./circle.png";

const CricketScore = () => {
  const [matchData, setMatchData] = useState([]);
  const [series, setSeries] = useState([]);
  const [inputData, setInputData] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("International");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const res = await fetch(
          "https://api.cricapi.com/v1/cricScore?apikey=31261486-fad2-4a8b-ba94-11ddca409e12"
        );
        const json = await res.json();
        setMatchData(json.data || []);
      } catch (err) {
        console.error("Match data fetch error:", err);
      }
    };

    const fetchSeries = async () => {
      try {
        const response = await fetch(
          "https://api.cricapi.com/v1/series?apikey=31261486-fad2-4a8b-ba94-11ddca409e12&offset=0"
        );
        const data = await response.json();
        if (data.status === "success") {
          setSeries(data.data);
          setFilteredSeries(data.data);
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
    fetchMatchData();
  }, []);

  const filterByType = (type) => {
    setFilterType(type);
    if (type === "international") {
      setFilteredSeries(series.filter((s) => /vs/i.test(s.name)));
    } else if (type === "domestic") {
      setFilteredSeries(series.filter((s) => !/vs/i.test(s.name)));
    } else {
      setFilteredSeries(series);
    }
  };

  const handleSearch = () => setSearch(inputData);

  const matchTypeFilter = (match) => {
    const isInt = ["t20", "odi", "test"].includes(match.matchType);
    return (filter === "International" && isInt) || (filter === "Domestic" && !isInt);
  };

  const searchFilter = (match) => {
    if (!search) return true;
    return (
      match.series?.toLowerCase().includes(search.toLowerCase()) ||
      match.t1?.toLowerCase().includes(search.toLowerCase()) ||
      match.t2?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const ongoingMatches = matchData.filter((m) =>
    m.status?.toLowerCase().includes("live")
  );
  const upcomingFixtures = matchData.filter(
    (m) =>
      m.status?.toLowerCase().includes("not started") &&
      matchTypeFilter(m) &&
      searchFilter(m)
  );
  const latestResults = matchData.filter((m) => {
    const status = m.status?.toLowerCase();
    return (
      (status.includes("won") ||
        status.includes("draw") ||
        status.includes("tie") ||
        status.includes("match over")) &&
      matchTypeFilter(m) &&
      searchFilter(m)
    );
  });

  return (
    <div className="main-container">
      {/* Header }
      <div className="serachbarr">
        <div className="heading" id="userr">
          <img src={circle} alt="avatar" />
          <p>Hi, Your name</p>
        </div>
      </div>

      {/* Search */}
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setInputData(e.target.value)}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>

      {/* Series Section */}
      <div className="section-title">Ongoing Series</div>
      <div className="tab-bar">
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => filterByType("all")}>All</button>
          <button
            onClick={() => filterByType("international")}
            style={{ marginLeft: "10px" }}
          >
            International
          </button>
          <button
            onClick={() => filterByType("domestic")}
            style={{ marginLeft: "10px" }}
          >
            Domestic
          </button>
          </div>
        </div>
        <div className="scroll-section">
          {filteredSeries.length > 0 ? (
            filteredSeries.map((s) => (
              <div className="card" key={s.id}>
                <h4>{s.name}</h4>
                <p>
                  <strong>{s.startDate}</strong> to{" "}
                  <strong>{s.endDate}</strong>
                </p>
                <p>Matches: {s.matches || 0}</p>
                <p>
                  ODI: {s.odi || 0}, T20: {s.t20 || 0}, Test: {s.test || 0}
                </p>
              </div>
            ))
          ) : (
            <p className="no-data">No series available</p>
          )}
        </div>
      </div>

      {/* Fixtures Section */}
      <div className="section-title">Upcoming Fixtures</div>
      <div className="tab-bar">
        <button
          className={filter === "International" ? "active" : ""}
          onClick={() => setFilter("International")}
        >
          International
        </button>
        <button
          className={filter === "Domestic" ? "active" : ""}
          onClick={() => setFilter("Domestic")}
        >
          Domestic
        </button>
      </div>
      <div className="scroll-section">
        {upcomingFixtures.length > 0 ? (
          upcomingFixtures.map((m, i) => (
            <div className="card" key={i}>
              <h4>{m.series}</h4>
              <p>{m.matchType?.toUpperCase()}</p>
              <div className="img">
                <div>
                  <img src={m.t1img} alt={m.t1} width={40} />
                  <p>{m.t1}</p>
                </div>
                <div>
                  <img src={m.t2img} alt={m.t2} width={40} />
                  <p>{m.t2}</p>
                </div>
              </div>
              <p className="status">Status: {m.status}</p>
              <Link to={`/match/${m.id}`}>
                <button className="details-btn">View Details</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data">No upcoming fixtures</p>
        )}
      </div>

      {/* Results Section */}
      <div className="section-title">Latest Results</div>
      <div className="tab-bar">
        <button
          className={filter === "International" ? "active" : ""}
          onClick={() => setFilter("International")}
        >
          International
        </button>
        <button
          className={filter === "Domestic" ? "active" : ""}
          onClick={() => setFilter("Domestic")}
        >
          Domestic
        </button>
      </div>
      <div className="scroll-section">
        {latestResults.length > 0 ? (
          latestResults.map((m, i) => (
            <div className="card" key={i}>
              <h4>{m.series}</h4>
              <p>{m.matchType?.toUpperCase()}</p>
              <div className="img">
                <div>
                  <img src={m.t1img} alt={m.t1} width={40} />
                  <p>{m.t1}</p>
                  <p>{m.t1s}</p>
                </div>
                <div>
                  <img src={m.t2img} alt={m.t2} width={40} />
                  <p>{m.t2}</p>
                  <p>{m.t2s}</p>
                </div>
              </div>
              <p className="status">Status: {m.status}</p>
              
              <Link to={`/match/${m.id}`}>
                <button className="details-btn">View Details</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data">No recent results</p>
        )}
      </div>

      {/* Navigation */}
      <div className="bottom-nav">
        <Link to="/"><button>Home</button></Link>
        <Link to="/matches"><button className="active">Matches</button></Link>
          <Link to="/friends"><button>Chatting</button></Link>
        <Link to="/more"><button>More</button></Link>
      </div>
    </div>
  );
};

export default CricketScore;
