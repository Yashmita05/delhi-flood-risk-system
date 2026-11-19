import { useState } from "react";
import { useMap } from "react-leaflet";
import {
  LuFlame,
  LuWaves,
  LuLayers,
  LuPlus,
  LuMinus,
  LuChevronLeft,
  LuChevronRight,
  LuMapPin,
  LuArrowUpRight,
  LuRotateCcw,
} from "react-icons/lu";

const RAIN_LEVELS = ["20", "50", "100", "real"];

const CRITICAL_ZONES = [
  { name: "Minto Bridge Underpass", lat: 28.6214, lng: 77.2311 },
  { name: "Zakhira Flyover", lat: 28.6900, lng: 77.1885 },
  { name: "ITO Ring Road Crossing", lat: 28.6289, lng: 77.2486 },
  { name: "Dwarka Sector 21 Underpass", lat: 28.5523, lng: 77.0583 },
  { name: "Pul Prahladpur Underpass", lat: 28.5020, lng: 77.2910 },
];

export default function SpatialHUDOverlay({
  layer,
  setLayer,
  rainfall,
  setRainfall,
  liveRain = 0,
  hotspots = [],
  drainageCount = 0,
  avgPriority = "64.7",
  selectedHotspot,
  onResetView,
  onSelectHotspot,
}) {
  const map = useMap();
  const [zoneIndex, setZoneIndex] = useState(0);

  // Stepper logic for Rainfall
  function handlePrevRain() {
    const idx = RAIN_LEVELS.indexOf(rainfall);
    const nextIdx = (idx - 1 + RAIN_LEVELS.length) % RAIN_LEVELS.length;
    setRainfall(RAIN_LEVELS[nextIdx]);
  }

  function handleNextRain() {
    const idx = RAIN_LEVELS.indexOf(rainfall);
    const nextIdx = (idx + 1) % RAIN_LEVELS.length;
    setRainfall(RAIN_LEVELS[nextIdx]);
  }

  // Explore Zones cyclic action
  function handleExploreZones() {
    const target = CRITICAL_ZONES[zoneIndex % CRITICAL_ZONES.length];
    setZoneIndex((prev) => prev + 1);

    map.flyTo([target.lat, target.lng], 15, { duration: 1.5 });

    // Match hotspot object from data
    const matched = hotspots.find(
      (h) => h.location?.toLowerCase() === target.name.toLowerCase()
    );
    if (matched && onSelectHotspot) {
      onSelectHotspot(matched);
    }
  }

  // Reset View action
  function handleReset() {
    map.setView([28.6139, 77.2090], 11, { duration: 1.2 });
    if (onResetView) {
      onResetView();
    }
  }

  // Rainfall labels & status
  let rainDisplay = "20 mm";
  let rainStatus = "Normal Monsoonal";
  let isAlert = false;

  if (rainfall === "50") {
    rainDisplay = "50 mm";
    rainStatus = "Elevated Inundation";
  } else if (rainfall === "100") {
    rainDisplay = "100 mm";
    rainStatus = "Severe Cloudburst";
    isAlert = true;
  } else if (rainfall === "real") {
    rainDisplay = liveRain > 0 ? `${liveRain} mm` : "0.0 mm";
    rainStatus = "Real-Time Telemetry";
  }

  // Counts
  const totalHotspots = hotspots.filter((h) => h.latitude && h.longitude).length || 50;
  const highRiskHotspots =
    hotspots.filter((h) => h.recurrence_level === "High").length || 20;

  return (
    <>
      {/* 3. Left-Edge Vertical Floating Glass Capsule Dock */}
      <div
        className="spatial-left-dock"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`spatial-dock-btn ${layer === "hotspots" ? "active" : ""}`}
          onClick={() => setLayer("hotspots")}
        >
          <LuFlame size={19} />
          <span className="spatial-dock-tooltip">Hotspots</span>
        </button>

        <button
          type="button"
          className={`spatial-dock-btn ${layer === "drainage" ? "active" : ""}`}
          onClick={() => setLayer("drainage")}
        >
          <LuWaves size={19} />
          <span className="spatial-dock-tooltip">Drainage</span>
        </button>

        <button
          type="button"
          className={`spatial-dock-btn ${layer === "heatmap" ? "active" : ""}`}
          onClick={() => setLayer("heatmap")}
        >
          <LuLayers size={19} />
          <span className="spatial-dock-tooltip">Heat Map</span>
        </button>

        <div className="spatial-dock-divider" />

        <button
          type="button"
          className="spatial-dock-btn"
          onClick={() => map.zoomIn()}
        >
          <LuPlus size={19} />
          <span className="spatial-dock-tooltip">Zoom In</span>
        </button>

        <button
          type="button"
          className="spatial-dock-btn"
          onClick={() => map.zoomOut()}
        >
          <LuMinus size={19} />
          <span className="spatial-dock-tooltip">Zoom Out</span>
        </button>
      </div>

      {/* 4. Three Floating Bottom Liquid Glass HUD Cards */}
      <div
        className="spatial-bottom-hud"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {/* Bottom-Left Card: Rainfall Threshold & Risk Scale Widget */}
        <div className="spatial-hud-card hud-card-rainfall">
          <div className="rainfall-top-row">
            <span className="rainfall-label-text">Rainfall & Risk Scale</span>
            <div className="rainfall-stepper-pill">
              <button
                type="button"
                className="stepper-btn"
                onClick={handlePrevRain}
                title="Previous threshold"
              >
                <LuChevronLeft size={13} />
              </button>
              <span className="stepper-value-text">
                {rainfall === "real" ? "Real" : `${rainfall}mm`}
              </span>
              <button
                type="button"
                className="stepper-btn"
                onClick={handleNextRain}
                title="Next threshold"
              >
                <LuChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="rainfall-middle-block">
            <span className="rainfall-big-num tabular-nums">{rainDisplay}</span>
            <span className={`rainfall-status-tag ${isAlert ? "alert" : ""}`}>
              {rainStatus}
            </span>
          </div>

          <div className="segmented-legend-container">
            <div className="segmented-color-bar">
              <div className="legend-segment low" title="Low Flood Risk" />
              <div className="legend-segment medium" title="Medium Flood Risk" />
              <div className="legend-segment high" title="High Flood Risk" />
            </div>
            <div className="segmented-legend-labels">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Bottom-Center Card: Compact Telemetry Squircle */}
        <div className="spatial-hud-card hud-card-telemetry">
          <div className="telemetry-row">
            <span className="telemetry-label">Avg Priority Score</span>
            <span className="telemetry-val-large tabular-nums">{avgPriority}</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-row">
            <span className="telemetry-label">Drainage Points</span>
            <span className="telemetry-val-mid tabular-nums">{drainageCount}</span>
          </div>
        </div>

        {/* Bottom-Right Card: Featured Summary & Hotspot Inspector Card */}
        <div className="spatial-hud-card hud-card-inspector">
          <div className="inspector-header-badge">
            <span className="status-pulse-green" />
            <span>
              {selectedHotspot
                ? selectedHotspot.location
                : "NCR Live Telemetry"}
            </span>
          </div>

          {selectedHotspot ? (
            <div className="inspector-detail-box">
              <div className="inspector-detail-row">
                <span>District / Area</span>
                <b style={{ color: "#FFFFFF" }}>{selectedHotspot.area || "Delhi"}</b>
              </div>
              <div className="inspector-detail-row">
                <span>Recurrence</span>
                <span
                  className={`spatial-risk-pill-mini ${
                    selectedHotspot.recurrence_level?.toLowerCase() || "high"
                  }`}
                >
                  {selectedHotspot.recurrence_level || "High"}
                </span>
              </div>
              {selectedHotspot.ml && (
                <div className="inspector-detail-row">
                  <span>ML Priority</span>
                  <b style={{ color: "#F87171" }}>
                    {selectedHotspot.ml.priority_score} / 100
                  </b>
                </div>
              )}
            </div>
          ) : (
            <div className="inspector-kpi-row">
              <div className="inspector-kpi-col">
                <span className="kpi-big-num tabular-nums">{totalHotspots}</span>
                <span className="kpi-sub-text">Hotspots</span>
              </div>
              <div className="inspector-kpi-col">
                <span className="kpi-big-num high-risk tabular-nums">
                  {highRiskHotspots}
                </span>
                <span className="kpi-sub-text">High Risk Zones</span>
              </div>
            </div>
          )}

          {selectedHotspot ? (
            <button
              type="button"
              className="spatial-white-pill-btn"
              onClick={handleReset}
            >
              <LuRotateCcw size={14} />
              <span>Reset View</span>
            </button>
          ) : (
            <button
              type="button"
              className="spatial-white-pill-btn"
              onClick={handleExploreZones}
            >
              <span>Explore Zones</span>
              <LuArrowUpRight size={15} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

