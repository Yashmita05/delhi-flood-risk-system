import { useState, useEffect } from "react";

import Navbar from "../components/layout/Navbar";
import DashboardCards from "../components/dashboard/DashboardCards";
import SearchBar from "../components/dashboard/SearchBar";

import Legend from "../components/map/Legend";
import MapView from "../components/map/MapView";
import HotspotLayer from "../components/map/HotspotLayer";
import DrainageLayer from "../components/map/DrainageLayer";
import HeatmapLayer from "../components/map/HeatmapLayer";
import RainfallSelector from "../components/map/RainfallSelector";

import "../styles/dashboard.css";

function Dashboard() {
  const [layer, setLayer] = useState("hotspots");
  const [searchText, setSearchText] = useState("");
  const [rainfall, setRainfall] = useState("20");
  const [liveRain, setLiveRain] = useState(0);

  // ✅ FIXED: useEffect INSIDE component
  useEffect(() => {
    async function fetchRain() {
      try {
        const res = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=7060cec6af1b9ac22192bc199d6d952b"
        );

        const data = await res.json();

        const rain = data?.rain?.["1h"] || 0;

        setLiveRain(rain);
      } catch (err) {
        console.log("Rain API error:", err);
      }
    }

    if (rainfall === "real") {
      fetchRain();

      const interval = setInterval(fetchRain, 60000);

      return () => clearInterval(interval);
    }
  }, [rainfall]);

  return (
    <>
      <Navbar />

      <div id="dashboard" className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Delhi Flood Risk Monitoring Dashboard</h1>
          <p>Flood Monitoring & Analysis</p>
        </div>

        {/* Dashboard Cards */}
        <DashboardCards />

        {/* Search + Rainfall */}
        <div className="dashboard-toolbar">
          <SearchBar onSearch={setSearchText} />
          <RainfallSelector onChange={setRainfall} />
        </div>

        {/* Map */}
        <div id="map" className="map-section">
          <div className="section-header">
            <h2>Flood Monitoring Map</h2>

            <div className="layer-buttons">
              <button
                className={layer === "hotspots" ? "active-layer" : ""}
                onClick={() => setLayer("hotspots")}
              >
                Hotspots
              </button>

              <button
                className={layer === "drainage" ? "active-layer" : ""}
                onClick={() => setLayer("drainage")}
              >
                Drainage
              </button>

              <button
                className={layer === "heatmap" ? "active-layer" : ""}
                onClick={() => setLayer("heatmap")}
              >
                Heat Map
              </button>
            </div>
          </div>

          {/* Map */}
          <MapView searchText={searchText} rainfall={rainfall} liveRain={liveRain}>
            {layer === "hotspots" && (
              <HotspotLayer rainfall={rainfall} liveRain={liveRain} />
            )}

            {layer === "drainage" && (
              <DrainageLayer rainfall={rainfall} />
            )}

            {layer === "heatmap" && (
              <HeatmapLayer rainfall={rainfall} liveRain={liveRain} />
            )}
          </MapView>

          <Legend />
        </div>
      </div>
    </>
  );
}

export default Dashboard;