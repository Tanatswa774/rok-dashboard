import React, { useState, useEffect } from "react";

function App() {
  const username = "tanatswa"; // hardcoded user
  const [botRunning, setBotRunning] = useState(false);
  const [gems, setGems] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setBotRunning(data.running);
    } catch (err) {
      setError("Failed to check bot status");
    }
  };

  const fetchGems = async () => {
    try {
      const res = await fetch("http://localhost:5000/gems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setGems(data.gems_found || 0);
      setLastUpdated(data.last_updated
        ? new Date(data.last_updated * 1000).toLocaleTimeString()
        : "N/A");
    } catch (err) {
      setError("Failed to load gem count");
    }
  };

  const startBot = async () => {
    try {
      const res = await fetch("http://localhost:5000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.status === "started") {
        setBotRunning(true);
      } else {
        setError(data.message || "Error starting bot");
      }
    } catch (err) {
      setError("Failed to start bot");
    }
  };

  const stopBot = async () => {
    try {
      const res = await fetch("http://localhost:5000/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.status === "stopped") {
        setBotRunning(false);
      } else {
        setError(data.message || "Error stopping bot");
      }
    } catch (err) {
      setError("Failed to stop bot");
    }
  };

  useEffect(() => {
    checkStatus();
    fetchGems();
    const interval = setInterval(fetchGems, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Rise of Kingdoms Bot Dashboard</h2>

      <p>Status: {botRunning ? "🟢 Running" : "🔴 Stopped"}</p>
      <p>Gems Found: {gems}</p>
      <p>Last Updated: {lastUpdated}</p>

      <button onClick={startBot} disabled={botRunning}>
        Start Bot
      </button>
      <button onClick={stopBot} disabled={!botRunning} style={{ marginLeft: "10px" }}>
        Stop Bot
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
