import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";

export default function HotspotLayer({ rainfall = "20" }) {
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
    if (level === "High") return "red";
    if (level === "Medium") return "orange";
    return "green";
  }

  return (
    <>
      {hotspots.map((spot, index) => {
        if (!spot.latitude || !spot.longitude) return null;

        const ml =
          govtData[spot.location?.trim().toLowerCase()];

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
            center={[
              Number(spot.latitude),
              Number(spot.longitude),
            ]}
            radius={radius}
            pathOptions={{
              color: getColor(adjustedLevel),
              fillColor: getColor(adjustedLevel),
              fillOpacity: rainfall === "real" ? 0.95 : 0.8,
              weight: rainfall === "100" ? 3 : 1,
            }}
          >
            <Popup>
              <h3>{spot.location}</h3>

              <hr />

              <b>Area:</b> {spot.area}
              <br />

              <b>Type:</b> {spot.hotspot_type}
              <br />

              <b>Recurrence:</b> {spot.recurrence_level}
              <br />

              <b>Source:</b> {spot.source}

              <hr />

              {ml ? (
                <>
                  <b>Predicted Flood Risk:</b>{" "}
                  {ml.predicted_flood_risk}
                  <br />

                  <b>Priority Score:</b>{" "}
                  {ml.priority_score}
                  <br />

                  <br />

                  <b>Recommended Action:</b>
                  <p>{ml.recommended_action}</p>
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