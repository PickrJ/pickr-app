import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "sb_publishable__RxQ1BmGw-rwRVq2b6uOqg_-zOnFrFh";

function formatOdds(value) {
  if (value === null || value === undefined) return "—";

  if (value >= 2) {
    return `+${Math.round((value - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (value - 1))}`;
  }
}

function getOdds(game) {
  const books = game?.data?.bookmakers || [];
  let bestHome = null;
  let bestAway = null;

  books.forEach((book) => {
    const market = book.markets?.find((m) => m.key === "h2h");
    if (!market) return;

    market.outcomes?.forEach((o) => {
      if (o.name === game.home_team) {
        if (bestHome === null || o.price > bestHome) bestHome = o.price;
      }
      if (o.name === game.away_team) {
        if (bestAway === null || o.price > bestAway) bestAway = o.price;
      }
    });
  });

  return { bestHome, bestAway };
}

export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const filtered = useMemo(() => {
    return games.filter((g) =>
      `${g.home_team} ${g.away_team}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [games, search]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">BETTOR RESEARCH</p>
          <h1>Pickr</h1>
          <p className="subtext">Track matchups, compare prices, and research faster.</p>
        </div>
      </header>

      <input
        className="search"
        placeholder="Search teams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="board-top">
        <h2>NBA Board</h2>
        <span>{filtered.length} games</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No games found</p>
      ) : (
        <div className="cards">
          {filtered.map((game) => {
            const odds = getOdds(game);

            return (
              <div className="card" key={game.id}>
                <div className="card-main">
                  <div className="teams">
                    <div className="team-row">
                      <span className="dot home"></span>
                      <span className="team-name">{game.home_team}</span>
                      <span className="team-odds">{formatOdds(odds.bestHome)}</span>
                    </div>

                    <div className="team-row">
                      <span className="dot away"></span>
                      <span className="team-name">{game.away_team}</span>
                      <span className="team-odds">{formatOdds(odds.bestAway)}</span>
                    </div>
                  </div>

                  <div className="meta">
                    {new Date(game.commence_time).toLocaleString()}
                  </div>
                </div>

                <div className="card-side">
                  <button className="open-btn">Open</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
