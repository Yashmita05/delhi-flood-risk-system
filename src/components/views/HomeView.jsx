import {
  LuArrowUpRight,
  LuDroplets,
  LuFlame,
  LuWaves,
  LuMapPin,
  LuLayers,
  LuActivity,
  LuShieldAlert,
} from "react-icons/lu";

const POPULAR_ZONES = [
  "Minto Bridge Underpass",
  "Zakhira Flyover",
  "ITO Ring Road Crossing",
  "Dwarka Sector 21 Underpass",
  "Pul Prahladpur Underpass",
  "Anand Vihar ISBT Area",
  "Najafgarh Drain Road",
];

export default function HomeView({ onGoToMap, onSelectLocation }) {
  return (
    <div className="spatial-page-content">
      {/* Spatial Hero Card */}
      <div className="spatial-hero-box">
        <div className="hero-content-col">
          <div className="hero-pill-badge">
            <span className="status-pulse-green" />
            <span>NCR Spatial Telemetry Platform</span>
          </div>

          <h1 className="hero-title-text">
            Delhi Flood Risk &amp; Drainage Intelligence
          </h1>

          <p className="hero-sub-text">
            Spatial decision support system integrating high-resolution GIS
            waterlogging hotspots, urban drainage network topology, and
            machine-learned flood recurrence modeling for the National Capital
            Territory of Delhi.
          </p>

          <div className="hero-btn-row">
            <button
              type="button"
              className="spatial-white-pill-btn"
              style={{ width: "auto" }}
              onClick={() => onGoToMap("hotspots")}
            >
              <span>Launch Spatial Map</span>
              <LuArrowUpRight size={15} />
            </button>

            <button
              type="button"
              className="spatial-pill-btn-secondary"
              onClick={() => onGoToMap("drainage")}
            >
              <LuWaves size={15} />
              <span>Inspect Drainage Network</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Spatial Glass Metric Cards */}
      <div className="spatial-cards-grid">
        <div className="spatial-stat-card">
          <div className="stat-icon-pill">
            <LuMapPin size={18} />
          </div>
          <span className="stat-num-val tabular-nums">50</span>
          <span className="stat-label-text">Monitored Hotspots</span>
        </div>

        <div className="spatial-stat-card">
          <div
            className="stat-icon-pill"
            style={{ color: "#F87171", background: "rgba(239, 68, 68, 0.12)" }}
          >
            <LuFlame size={18} />
          </div>
          <span
            className="stat-num-val tabular-nums"
            style={{ color: "#F87171" }}
          >
            20
          </span>
          <span className="stat-label-text">High Risk Inundation Zones</span>
        </div>

        <div className="spatial-stat-card">
          <div
            className="stat-icon-pill"
            style={{ color: "#FBBF24", background: "rgba(245, 158, 11, 0.12)" }}
          >
            <LuShieldAlert size={18} />
          </div>
          <span className="stat-num-val tabular-nums">64.7</span>
          <span className="stat-label-text">Avg Priority Dispatch Score</span>
        </div>

        <div className="spatial-stat-card">
          <div
            className="stat-icon-pill"
            style={{ color: "#34D399", background: "rgba(16, 185, 129, 0.12)" }}
          >
            <LuActivity size={18} />
          </div>
          <span
            className="stat-num-val tabular-nums"
            style={{ color: "#34D399", fontSize: "24px" }}
          >
            Active
          </span>
          <span className="stat-label-text">OpenWeather Live Ingestion</span>
        </div>
      </div>

      {/* Critical Hotspots Fast Jump */}
      <div className="fast-chips-section">
        <span className="section-caption-label">
          Quick Access Critical Hotspots
        </span>
        <div className="chips-row">
          {POPULAR_ZONES.map((zone, i) => (
            <button
              key={i}
              type="button"
              className="fast-chip-pill"
              onClick={() => onSelectLocation(zone)}
            >
              <LuMapPin size={13} color="#38BDF8" />
              <span>{zone}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core System Capabilities */}
      <div className="spatial-feature-grid">
        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuDroplets size={18} />
          </div>
          <h3>Dynamic Rainfall Simulation</h3>
          <p>
            Simulate 20mm baseline monsoons, 50mm intense downpours, or 100mm
            extreme cloudbursts to evaluate localized flood depths and drainage
            saturation thresholds.
          </p>
        </div>

        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuLayers size={18} />
          </div>
          <h3>Multi-Layer GIS Telemetry</h3>
          <p>
            Switch seamlessly between individual waterlogging hotspots, the
            underlying stormwater conduit grid, and heat density maps calibrated
            with historical recurrence records.
          </p>
        </div>

        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuShieldAlert size={18} />
          </div>
          <h3>Government Action Engine</h3>
          <p>
            Rule-based and ML-recommended interventions dispatching super-sucker
            machines, pump deployments, and preventive desilting schedules
            aligned with DDMA emergency protocols.
          </p>
        </div>
      </div>
    </div>
  );
}

