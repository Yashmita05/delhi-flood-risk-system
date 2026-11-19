import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";

export default function HotspotLayer({
  rainfall = "20",
  liveRain = 0,
  onSelectHotspot,
}) {
  const [hotspots, setHotspots] = useState([]);
  const [govtData, setGovtData] = useState({});

  useEffect(() => {
    // Load hotspots
    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setHotspots(results.data);
      },
    });

    // Load government / ML data
    Papa.parse("/data/govt_flood_action_plan.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const data = {};
        results.data.forEach((row) => {
          if (row.location) {
            data[row.location.trim().toLowerCase()] = row;
          }
        });
        setGovtData(data);
      },
    });
  }, []);

  function getColor(level) {
    if (level === "High") return "#EF4444";
    if (level === "Medium") return "#F59E0B";
    return "#10B981";
  }

  return (
    <>
      {hotspots.map((spot, index) => {
        if (!spot.latitude || !spot.longitude) return null;

        const ml = govtData[spot.location?.trim().toLowerCase()];

        // ----------------------------
        // RAINFALL EFFECT ON RISK
        // ----------------------------
        let adjustedLevel = spot.recurrence_level;

        if (rainfall === "50") {
          if (adjustedLevel === "Low") adjustedLevel = "Medium";
        }

        if (rainfall === "100") {
          if (adjustedLevel === "Low") adjustedLevel = "Medium";
          if (adjustedLevel === "Medium") adjustedLevel = "High";
        }

        if (rainfall === "real") {
          adjustedLevel = "High";
        }

        // radius scaling based on rainfall
        let radius = 8;
        if (rainfall === "50") radius = 9;
        if (rainfall === "100") radius = 11;
        if (rainfall === "real") radius = 12;

        return (
          <CircleMarker
            key={index}
            center={[Number(spot.latitude), Number(spot.longitude)]}
            radius={radius}
            pathOptions={{
              color: getColor(adjustedLevel),
              fillColor: getColor(adjustedLevel),
              fillOpacity: rainfall === "real" ? 0.95 : 0.8,
              weight: rainfall === "100" ? 3 : 2,
            }}
            eventHandlers={{
              click: () => {
                if (onSelectHotspot) {
                  onSelectHotspot({ ...spot, ml });
                }
              },
            }}
          >
            <Popup>
              <h3>{spot.location}</h3>
              <hr />
              <p>
                <b>Area:</b> {spot.area || "NCT Delhi"}
              </p>
              <p>
                <b>Type:</b> {spot.hotspot_type}
              </p>
              <p>
                <b>Recurrence Level:</b>{" "}
                <span
                  style={{
                    color: getColor(adjustedLevel),
                    fontWeight: 600,
                  }}
                >
                  {adjustedLevel}
                </span>
              </p>
              <p>
                <b>Source:</b> {spot.source}
              </p>

              <hr />

              {ml ? (
                <>
                  <p>
                    <b>Predicted Risk:</b> {ml.predicted_flood_risk}
                  </p>
                  <p>
                    <b>Priority Score:</b> {ml.priority_score} / 100
                  </p>
                  <br />
                  <b>Recommended Action:</b>
                  <p style={{ marginTop: "4px", fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
                    {ml.recommended_action}
                  </p>
                </>
              ) : (
                <p>No ML Prediction Available</p>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
