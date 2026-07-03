import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";

export default function DrainageLayer() {
  const [drainage, setDrainage] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    Papa.parse("/data/delhi_drainage_dummy_dataset.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setDrainage(results.data);
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
    if (quality === "Poor") return "#b30000";
    if (quality === "Moderate") return "#ff8c00";
    return "#2e8b57";
  }

  return (
    <>
      {drainage.map((drain, index) => {
        const hotspot = hotspots[index];

        if (!hotspot) return null;

        return (
          <CircleMarker
            key={index}
            center={[
              Number(hotspot.latitude),
              Number(hotspot.longitude),
            ]}
            radius={7}
            pathOptions={{
              color: getColor(drain.drainage_quality),
              fillColor: getColor(drain.drainage_quality),
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <h3>{drain.location}</h3>

              <hr />

              <b>Drainage Basin:</b> {drain.dominant_basin}
              <br />

              <b>Drain Type:</b> {drain.dominant_drain_type}
              <br />

              <b>Drain Length:</b> {drain.approx_drain_length_m} m
              <br />

              <b>Manholes:</b> {drain.estimated_manhole_count}
              <br />

              <b>Drainage Quality:</b> {drain.drainage_quality}
              <br />

              <b>Sewage Mixing Risk:</b> {drain.sewage_mixing_risk}
              <br />

              <b>Flooding Frequency:</b> {drain.flooding_frequency}
              <br /><br />

              <b>Main Issues</b>

              <p>{drain.main_issues}</p>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}