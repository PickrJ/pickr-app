import { useEffect, useState } from "react";

export default function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadGames() {
      const res = await fetch(
        "https://qjzvajxyfpflzppqpuns.supabase.co/rest/v1/odds_current?select=*",
        {
          headers: {
            apikey: "sb_publishable__RxQ1BmGw-rwRVq2b6uOqg_-zOnFrFh",
            Authorization: "sb_publishable__RxQ1BmGw-rwRVq2b6uOqg_-zOnFrFh",
          },
        }
      );

      const data = await res.json();
      setGames(data);
    }

    loadGames();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Pickr</h1>
      <p>Live NBA Games</p>

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
