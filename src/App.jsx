import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "sb_publishable__RxQ1BmGw-rwRVq2b6u0qg__zOnFrFh";

const SPORTS = ["NBA", "NFL", "MLB", "Soccer", "Tennis", "Golf", "Boxing", "CS2"];

export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("NBA");
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

  const featuredGame = filteredGames[0] || null;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1 className="logo">Pickr</h1>
          <p className="subtitle">Research lines. Find value. Move faster.</p>
        </div>
        <button className="profile-btn">J</button>
      </header>

      <section className="search-wrap">
        <input
          className="search-input"
          placeholder="Search teams, games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="sports-row">
        {SPORTS.map((sport) => (
          <button
            key={sport}
            className={`sport-pill ${selectedSport === sport ? "active" : ""}`}
            onClick={() => setSelectedSport(sport)}
          >
            {sport}
          </button>
        ))}
      </section>

      <section className="hero-card">
        <div className="hero-text">
          <p className="eyebrow">Today’s board</p>
          <h2>Live research dashboard</h2>
          <p>Clean matchups, fast decisions.</p>
        </div>
        <div className="hero-badge">Pickr</div>
      </section>

      {featuredGame && (
        <section className="section">
          <div className="section-head">
            <h3>Featured matchup</h3>
          </div>

          <div className="featured-card">
            <div className="featured-matchup">
              <div>
                <p className="team-label">Home</p>
                <h2>{featuredGame.home_team}</h2>
              </div>

              <div className="vs-wrap">VS</div>

              <div>
                <p className="team-label">Away</p>
                <h2>{featuredGame.away_team}</h2>
              </div>
            </div>

            <div className="featured-footer">
              <span>{new Date(featuredGame.commence_time).toLocaleString()}</span>
              <button className="details-btn">Open</button>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h3>{selectedSport} Games</h3>
          <span>{filteredGames.length}</span>
        </div>

        {loading ? (
          <div className="empty-card">Loading...</div>
        ) : (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <div className="game-card" key={game.id}>
                <div className="game-top">
                  <span>{selectedSport}</span>
                  <span>{new Date(game.commence_time).toLocaleString()}</span>
                </div>

                <div className="teams-block">
                  <div>{game.home_team}</div>
                  <div>{game.away_team}</div>
                </div>

                <button className="open-btn">View</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
