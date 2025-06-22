import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://flask-backend-82sx.onrender.com"; // Replace with your Flask backend URL

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [gemsFound, setGemsFound] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const fetchStatus = async () => {
    try {
      console.log("Fetching status...");
      const res = await fetch(`${API_URL}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "tanatswa" }),
      });
      console.log("Status response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("Status data:", data);
      setIsRunning(data.running);
    } catch (err) {
      console.error("Status error", err);
    }
  };

  const fetchGems = async () => {
    try {
      console.log("Fetching gems...");
      const res = await fetch(`${API_URL}/gems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "tanatswa" }),
      });
      console.log("Gems response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("Gems data:", data);
      setGemsFound(data.gems_found || 0);
      setLastUpdated(
        data.last_updated ? new Date(data.last_updated * 1000).toLocaleString() : null
      );
    } catch (err) {
      console.error("Gem fetch error", err);
    }
  };

  const fetchScreenshot = () => {
    const url = `${API_URL}/screenshot?${Date.now()}`;
    console.log("Updating screenshot URL:", url);
    setScreenshotUrl(url);
  };

  const startBot = async () => {
    console.log("Start button clicked");
    try {
      const res = await fetch(`${API_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "tanatswa" }),
      });
      console.log("Start response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("StartBot response data:", data);
      fetchStatus();
    } catch (err) {
      console.error("Start error", err);
    }
  };

  const stopBot = async () => {
    console.log("Stop button clicked");
    try {
      const res = await fetch(`${API_URL}/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "tanatswa" }),
      });
      console.log("Stop response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("StopBot response data:", data);
      fetchStatus();
    } catch (err) {
      console.error("Stop error", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchGems();
    fetchScreenshot();
    const interval = setInterval(() => {
      fetchStatus();
      fetchGems();
      fetchScreenshot();
    }, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Rise of Kingdoms Bot Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={startBot} disabled={isRunning}>
          ▶️ Start Bot
        </button>
        <button onClick={stopBot} disabled={!isRunning}>
          ⏹️ Stop Bot
        </button>
      </div>

      <div>
        <p>
          🔄 Bot status: <strong>{isRunning ? "Running" : "Stopped"}</strong>
        </p>
        <p>
          💎 Gems Found: <strong>{gemsFound}</strong>
        </p>
        {lastUpdated && <p>🕒 Last Updated: {lastUpdated}</p>}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>📸 Latest Screenshot</h3>
        <img
          src={screenshotUrl}
          alt="Latest"
          style={{ width: "70%", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}

export default App;
