import { useEffect, useState } from "react";
import "./App.css";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "sb_publishable__RxQ1BmGw-rwRVq2b6uOqg_-zOnFrFh";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/odds_current?select=id,home_team,away_team,commence_time`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const text = await res.text();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = JSON.parse(text);
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(String(err));
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Pickr</h1>
      <p>Live NBA Games</p>

      {loading && <p>Loading...</p>}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && games.length === 0 && <p>No games found.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3>
              {game.home_team} vs {game.away_team}
            </h3>
            <p>{new Date(game.commence_time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
