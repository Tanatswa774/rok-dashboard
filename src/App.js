import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://flask-backend-82sx.onrender.com";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [gems, setGems] = useState(0);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const username = "default";

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setIsRunning(data.running);
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  };

  const fetchGems = async () => {
    try {
      const res = await fetch(`${API_URL}/gems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setGems(data.gems_found || 0);
    } catch (err) {
      console.error("Failed to fetch gems", err);
    }
  };

  const fetchScreenshot = () => {
    setScreenshotUrl(`${API_URL}/screenshot?${Date.now()}`);
  };

  const startBot = async () => {
    try {
      const res = await fetch(`${API_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Start bot failed: " + errText);
        return;
      }

      const data = await res.json();
      console.log("Started bot:", data);
      fetchStatus();
    } catch (err) {
      console.error("Start error", err);
      alert("Failed to start bot: " + err.message);
    }
  };

  const stopBot = async () => {
    try {
      const res = await fetch(`${API_URL}/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Stop bot failed: " + errText);
        return;
      }

      const data = await res.json();
      console.log("Stopped bot:", data);
      fetchStatus();
    } catch (err) {
      console.error("Stop error", err);
      alert("Failed to stop bot: " + err.message);
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
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Rise of Kingdoms Bot Dashboard</h1>

      <p>Status: <strong style={{ color: isRunning ? "green" : "red" }}>{isRunning ? "Running" : "Stopped"}</strong></p>
      <p>Gems Collected: <strong>{gems}</strong></p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={startBot} disabled={isRunning}>Start Bot</button>
        <button onClick={stopBot} disabled={!isRunning}>Stop Bot</button>
      </div>

      <div>
        <h3>Latest Screenshot</h3>
        {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" style={{ width: "80%", border: "1px solid #ccc" }} />}
      </div>
    </div>
  );
}

export default App;
