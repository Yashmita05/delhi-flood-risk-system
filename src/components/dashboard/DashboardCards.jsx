import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function DashboardCards() {
  const [hotspots, setHotspots] = useState([]);
  const [drainage, setDrainage] = useState([]);
  const [govt, setGovt] = useState([]);

  useEffect(() => {
    // Hotspots
    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: (res) => setHotspots(res.data),
    });

    // Drainage
    Papa.parse("/data/delhi_drainage_dummy_dataset.csv", {
      download: true,
      header: true,
      complete: (res) => setDrainage(res.data),
    });

    // Govt / ML
    Papa.parse("/data/govt_flood_action_plan.csv", {
      download: true,
      header: true,
      complete: (res) => setGovt(res.data),
    });
  }, []);

  // 🔴 Total hotspots
  const totalHotspots = hotspots.filter(
    (h) => h.latitude && h.longitude
  ).length;

  // 🔥 High risk hotspots
  const highRisk = hotspots.filter(
    (h) => h.recurrence_level === "High"
  ).length;

  // 🚰 Drainage entries
  const drainageCount = drainage.filter(
    (d) => d.location
  ).length;

  // ⚠️ Average priority score
  const avgPriority =
    govt.length > 0
      ? (
          govt.reduce(
            (sum, item) => sum + Number(item.priority_score || 0),
            0
          ) / govt.length
        ).toFixed(1)
      : 0;

  return (
    <div className="dashboard-cards">
      <div className="card">
        <h3>Total Hotspots</h3>
        <p>{totalHotspots}</p>
      </div>

      <div className="card">
        <h3>High Risk Zones</h3>
        <p>{highRisk}</p>
      </div>

      <div className="card">
        <h3>Drainage Points</h3>
        <p>{drainageCount}</p>
      </div>

      <div className="card">
        <h3>Avg Priority Score</h3>
        <p>{avgPriority}</p>
      </div>
    </div>
  );
}