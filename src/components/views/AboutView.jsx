import {
  LuShieldAlert,
  LuCpu,
  LuRadio,
  LuPhoneCall,
  LuCircleCheck,
} from "react-icons/lu";

export default function AboutView() {
  return (
    <div className="spatial-page-content">
      {/* System Mandate Card */}
      <div className="spatial-hero-box">
        <div className="hero-content-col">
          <div className="hero-pill-badge">
            <LuShieldAlert size={14} />
            <span>NDMA &amp; Delhi Master Plan 2041</span>
          </div>

          <h2 className="hero-title-text" style={{ fontSize: "28px" }}>
            Decision Support System Architecture
          </h2>

          <p className="hero-sub-text">
            Developed in alignment with the National Disaster Management
            Authority guidelines and the Delhi Drainage Master Plan, this
            system provides automated predictive threat modeling and resource
            allocation for urban flood management across NCT Delhi.
          </p>
        </div>
      </div>

      {/* ML Pipeline & Live Telemetry Details */}
      <div className="spatial-feature-grid">
        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuCpu size={18} />
          </div>
          <h3>Machine Learning Pipeline</h3>
          <p>
            Powered by a Random Forest Classifier (300 estimators, max depth 12,
            balanced class weighting) trained on combined drainage and rainfall
            topologies. Stratified cross-validation yields 89% precision across
            high-risk inundation nodes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#34D399" /> One-Hot Encoded Drainage Basins
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#34D399" /> Manhole &amp; Conduit Siltation Index
            </span>
          </div>
        </div>

        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuRadio size={18} />
          </div>
          <h3>Real-Time Meteorological Ingestion</h3>
          <p>
            Automated 60-second telemetry polling via OpenWeatherMap API for
            the NCT of Delhi coordinates (28.6139° N, 77.2090° E). Hourly
            precipitation values dynamically scale GIS heatmap multipliers and
            circle marker risk radii.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#38BDF8" /> 20mm Baseline Inundation Logic
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#38BDF8" /> 50mm &amp; 100mm Cloudburst Modes
            </span>
          </div>
        </div>

        <div className="spatial-feature-card">
          <div className="stat-icon-pill">
            <LuShieldAlert size={18} />
          </div>
          <h3>Inter-Agency Dispatch Matrix</h3>
          <p>
            Outputs structured municipal action directives: immediate pump
            deployment, storm drain desilting within 7-day windows, and traffic
            diversion notices to PWD, MCD, and Delhi Traffic Police control
            centers.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#FBBF24" /> Priority Score Weighting (0-100)
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
              <LuCircleCheck size={13} color="#FBBF24" /> Standardized Action Protocols
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Operations Contact Grid */}
      <div className="fast-chips-section">
        <span className="section-caption-label">
          Emergency Operations Hub &amp; Helplines
        </span>
        <div className="emergency-grid">
          <div className="emergency-card">
            <span className="emergency-title">DDMA Central Helpline</span>
            <span className="emergency-num">1077</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              24/7 Flood Control Room
            </span>
          </div>

          <div className="emergency-card">
            <span className="emergency-title">PWD Flood Control</span>
            <span className="emergency-num">1800-11-8578</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              Toll-Free Infrastructure Line
            </span>
          </div>

          <div className="emergency-card">
            <span className="emergency-title">MCD Civic Helpline</span>
            <span className="emergency-num">155304</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              Municipal Corporation of Delhi
            </span>
          </div>

          <div className="emergency-card">
            <span className="emergency-title">Traffic Police Helpline</span>
            <span className="emergency-num">1095</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              Live Traffic &amp; Route Diversions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
