import { useState, useEffect } from "react";
import Papa from "papaparse";

import TopWindowBar from "../components/layout/TopWindowBar";
import MapView from "../components/map/MapView";
import HotspotLayer from "../components/map/HotspotLayer";
import DrainageLayer from "../components/map/DrainageLayer";
import HeatmapLayer from "../components/map/HeatmapLayer";
import HomeView from "../components/views/HomeView";
import AboutView from "../components/views/AboutView";

import "../styles/dashboard.css";

export default function Dashboard({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
}) {
  const [internalTab, setInternalTab] = useState("dashboard");
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setInternalTab;
  const [layer, setLayer] = useState("hotspots");
  const [searchText, setSearchText] = useState("");
  const [rainfall, setRainfall] = useState("20");
  const [liveRain, setLiveRain] = useState(0);

  const [hotspots, setHotspots] = useState([]);
  const [drainage, setDrainage] = useState([]);
  const [govt, setGovt] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Load telemetry datasets for global HUD & Search
  useEffect(() => {
    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: (res) => setHotspots(res.data),
    });

    Papa.parse("/data/delhi_drainage_dummy_dataset.csv", {
      download: true,
      header: true,
      complete: (res) => setDrainage(res.data),
      error: () => {
        Papa.parse("/data/delhi_drainage _dummy_dataset.csv", {
          download: true,
          header: true,
          complete: (res) => setDrainage(res.data),
        });
      },
    });

    Papa.parse("/data/govt_flood_action_plan.csv", {
      download: true,
      header: true,
      complete: (res) => setGovt(res.data),
    });
  }, []);

  // 100% Preserved OpenWeatherMap Live Rain API
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

  // Handle location selection from search bar or quick jump
  function handleSelectLocation(locationName) {
    setSearchText(locationName);
    const match = hotspots.find(
      (h) => h.location?.toLowerCase() === locationName.toLowerCase()
    );
    if (match) {
      const ml = govt.find(
        (g) => g.location?.toLowerCase() === match.location?.toLowerCase()
      );
      setSelectedHotspot({ ...match, ml });
    }
  }

  // Calculate Avg Priority Score & Drainage Points
  const avgPriority =
    govt.length > 0
      ? (
          govt.reduce((sum, item) => sum + Number(item.priority_score || 0), 0) /
          govt.length
        ).toFixed(1)
      : "64.7";

  const drainageCount =
    drainage.filter((d) => d.location).length || 0;

  return (
    <div className="spatial-canvas">
      {/* Ambient background glow */}
      <div className="spatial-ambient-glow" />

      {/* Centered Elevated Spatial Window */}
      <div className="spatial-window">
        {/* Integrated Frosted Top Window Bar */}
        <TopWindowBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchText={searchText}
          onSearch={(val) => {
            setSearchText(val);
            if (!val.trim()) {
              setSelectedHotspot(null);
            }
          }}
          hotspots={hotspots}
          onSelectLocation={handleSelectLocation}
        />

        {/* Dynamic Spatial View Switcher */}
        {activeTab === "dashboard" && (
          <MapView
            searchText={searchText}
            setSearchText={setSearchText}
            rainfall={rainfall}
            setRainfall={setRainfall}
            liveRain={liveRain}
            layer={layer}
            setLayer={setLayer}
            selectedHotspot={selectedHotspot}
            setSelectedHotspot={setSelectedHotspot}
            drainageCount={drainageCount}
            avgPriority={avgPriority}
          >
            {layer === "hotspots" && (
              <HotspotLayer
                rainfall={rainfall}
                liveRain={liveRain}
                onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              />
            )}

            {layer === "drainage" && (
              <DrainageLayer
                onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              />
            )}

            {layer === "heatmap" && (
              <HeatmapLayer rainfall={rainfall} liveRain={liveRain} />
            )}
          </MapView>
        )}

        {activeTab === "home" && (
          <HomeView
            onGoToMap={(targetLayer) => {
              if (targetLayer) setLayer(targetLayer);
              setActiveTab("dashboard");
            }}
            onSelectLocation={(locName) => {
              handleSelectLocation(locName);
              setActiveTab("dashboard");
            }}
          />
        )}

        {activeTab === "about" && <AboutView />}
      </div>
    </div>
  );
}
