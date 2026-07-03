import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import Papa from "papaparse";

export default function HeatmapLayer({ rainfall = "20" }) {
  const map = useMap();

  useEffect(() => {
    let heatLayer;

    // rainfall intensity multiplier
    let multiplier = 1;

    if (rainfall === "50") multiplier = 1.3;
    else if (rainfall === "100") multiplier = 1.8;
    else if (rainfall === "real") multiplier = 2.2;

    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: function (hotspots) {
        Papa.parse("/data/govt_flood_action_plan.csv", {
          download: true,
          header: true,
          complete: function (govt) {
            const priorityMap = {};

            govt.data.forEach((row) => {
              if (row.location) {
                priorityMap[row.location.trim().toLowerCase()] =
                  Number(row.priority_score);
              }
            });

            const heatData = [];

            hotspots.data.forEach((spot) => {
              if (!spot.latitude || !spot.longitude) return;

              const priority =
                priorityMap[spot.location.trim().toLowerCase()] || 30;

              heatData.push([
                Number(spot.latitude),
                Number(spot.longitude),
                (priority / 100) * multiplier,
              ]);
            });

            heatLayer = L.heatLayer(heatData, {
              radius: 18,
              blur: 12,
              maxZoom: 17,
              minOpacity: 0.35,
              gradient: {
                0.2: "#2ecc71",
                0.5: "#f1c40f",
                0.7: "#e67e22",
                1.0: "#e74c3c",
              },
            }).addTo(map);
          },
        });
      },
    });

    return () => {
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, rainfall]);

  return null;
}