import { useEffect, useState } from "react";

const SUPABASE_URL = "https://qjzvajxyfpflzppqpuns.supabase.co";
const SUPABASE_KEY = "sb_publishable__RxQ1BmGw-rwRVq2b6uOqg_-zOnFrFh";

export default function App() {
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function loadGames() {
      try {
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
        console.log("STATUS:", res.status);
        console.log("BODY:", text);

        if (!res.ok) {
          setMessage(`Error ${res.status}: ${text}`);
          return;
        }

        const data = JSON.parse(text);

        if (!Array.isArray(data) || data.length === 0) {
          setMessage("Connected, but Supabase returned 0 rows.");
          setGames([]);
          return;
        }

        setGames(data);
        setMessage(`Loaded ${data.length} games`);
      } catch (err) {
        setMessage(`Fetch failed: ${String(err)}`);
      }
    }

    loadGames();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Pickr</h1>
      <p>{message}</p>

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
