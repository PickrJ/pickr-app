import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

const SPORTS = ["NBA", "NFL", "MLB", "Soccer", "Tennis", "Golf", "Boxing", "CS2"];
const TABS = ["Games", "Props", "Trends", "Insights"];

export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("NBA");
  const [selectedTab, setSelectedTab] = useState("Games");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/odds_current?select=*`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load games:", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchup = `${game.home_team} ${game.away_team}`.toLowerCase();
      return matchup.includes(search.toLowerCase());
    });
  }, [games, search]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">BETTOR RESEARCH DASHBOARD</div>
          <h1 className="logo">Pickr</h1>
          <p className="subtitle">
            Scan boards, compare spots, and organize your research faster.
          </p>
        </div>
        <div className="avatar">J</div>
      </header>

      <section className="toolbar">
        <input
          className="search-input"
          placeholder="Search teams or matchups"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tabs-row">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="sports-row">
          {SPORTS.map((sport) => (
            <button
              key={sport}
              className={`sport-pill ${selectedSport === sport ? "active" : ""}`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport}
            </button>
          ))}
        </div>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Sport</span>
          <strong>{selectedSport}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Board Size</span>
          <strong>{filteredGames.length} Games</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Mode</span>
          <strong>{selectedTab}</strong>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{selectedSport} Research Board</h2>
          <span>{filteredGames.length} matchups</span>
        </div>

        <div className="column-labels">
          <span>Matchup</span>
          <span>Start Time</span>
          <span>Research</span>
        </div>

        {loading ? (
          <div className="empty-card">Loading board...</div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-card">No games found.</div>
        ) : (
          <div className="board-list">
            {filteredGames.map((game) => (
              <article className="research-card" key={game.id}>
                <div className="matchup-block">
                  <div className="team-line">
                    <span className="team-marker home" />
                    <span>{game.home_team}</span>
                  </div>
                  <div className="team-line">
                    <span className="team-marker away" />
                    <span>{game.away_team}</span>
                  </div>
                </div>

                <div className="time-block">
                  {new Date(game.commence_time).toLocaleString()}
                </div>

                <div className="research-block">
                  <div className="tag-row">
                    <span className="tag">Markets</span>
                    <span className="tag">Lines</span>
                    <span className="tag">Notes</span>
                  </div>
                  <button className="open-btn">Open</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
