import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";

export default function DrainageLayer({ onSelectHotspot }) {
  const [drainage, setDrainage] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    Papa.parse("/data/delhi_drainage_dummy_dataset.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setDrainage(results.data);
      },
      error: () => {
        // Fallback for spaced filename
        Papa.parse("/data/delhi_drainage _dummy_dataset.csv", {
          download: true,
          header: true,
          complete: (results) => setDrainage(results.data),
        });
      },
    });

    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setHotspots(results.data);
      },
    });
  }, []);

  function getColor(quality) {
    if (quality === "Poor") return "#EF4444";
    if (quality === "Moderate") return "#F59E0B";
    return "#10B981";
  }

  return (
    <>
      {drainage.map((drain, index) => {
        const hotspot = hotspots[index];

        if (
          !hotspot ||
          !hotspot.latitude ||
          !hotspot.longitude ||
          isNaN(Number(hotspot.latitude)) ||
          isNaN(Number(hotspot.longitude))
        ) {
          return null;
        }

        return (
          <CircleMarker
            key={index}
            center={[Number(hotspot.latitude), Number(hotspot.longitude)]}
            radius={7}
            pathOptions={{
              color: getColor(drain.drainage_quality),
              fillColor: getColor(drain.drainage_quality),
              fillOpacity: 0.85,
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                if (onSelectHotspot) {
                  onSelectHotspot({
                    location: drain.location || hotspot.location,
                    area: hotspot.area || "Delhi",
                    recurrence_level: drain.flooding_frequency || "Medium",
                    ml: {
                      priority_score: drain.drainage_quality === "Poor" ? "88" : "60",
                      recommended_action: drain.main_issues || "Drain inspection required",
                    },
                  });
                }
              },
            }}
          >
            <Popup>
              <h3>{drain.location || hotspot.location}</h3>
              <hr />
              <p>
                <b>Drainage Basin:</b> {drain.dominant_basin}
              </p>
              <p>
                <b>Drain Type:</b> {drain.dominant_drain_type}
              </p>
              <p>
                <b>Approx Length:</b> {drain.approx_drain_length_m} m
              </p>
              <p>
                <b>Estimated Manholes:</b> {drain.estimated_manhole_count}
              </p>
              <p>
                <b>Drainage Quality:</b>{" "}
                <span
                  style={{
                    color: getColor(drain.drainage_quality),
                    fontWeight: 600,
                  }}
                >
                  {drain.drainage_quality}
                </span>
              </p>
              <p>
                <b>Sewage Mixing Risk:</b> {drain.sewage_mixing_risk}
              </p>
              <p>
                <b>Flooding Frequency:</b> {drain.flooding_frequency}
              </p>

              <hr />

              <b>Main Issues</b>
              <p style={{ marginTop: "4px", fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
                {drain.main_issues}
              </p>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
