import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_KEY_HERE";

function formatOdds(value) {
  if (value === null || value === undefined) return "—";

  // decimal → American odds
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
        if (bestHome === null || o.price > bestHome) {
          bestHome = o.price;
        }
      }
      if (o.name === game.away_team) {
        if (bestAway === null || o.price > bestAway) {
          bestAway = o.price;
        }
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
      `${g.home_team} ${g.away_team}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [games, search]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Pickr</h1>

      <input
        placeholder="Search teams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          width: "100%",
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No games found</p>
      ) : (
        filtered.map((game) => {
          const odds = getOdds(game);

          return (
            <div
              key={game.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                borderRadius: 12,
              }}
            >
              <h3>
                {game.home_team} ({formatOdds(odds.bestHome)})
              </h3>
              <h3>
                {game.away_team} ({formatOdds(odds.bestAway)})
              </h3>

              <p>
                {new Date(game.commence_time).toLocaleString()}
              </p>

              <button
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "black",
                  color: "white",
                  border: "none",
                }}
              >
                Open
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
