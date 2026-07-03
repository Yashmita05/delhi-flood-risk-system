import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import React from "react";

function MapController({ searchText, hotspots }) {
  const map = useMap();

  useEffect(() => {
    if (!searchText) return;

    const match = hotspots.find((h) =>
      h.location?.toLowerCase() === searchText.toLowerCase()
    );

    if (match) {
      const lat = Number(match.latitude);
      const lng = Number(match.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 15, { duration: 1.5 });
      }
    }
  }, [searchText]);

  return null;
}

export default function MapView({
  children,
  searchText,
  rainfall,
}) {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    Papa.parse("/data/hotspots.csv", {
      download: true,
      header: true,
      complete: (res) => {
        setHotspots(res.data);
      },
    });
  }, []);

  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={11}
      style={{
        height: "80vh",
        width: "100%",
        borderRadius: "15px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Search Controller */}
      <MapController
        searchText={searchText}
        hotspots={hotspots}
      />

      {/* Pass rainfall + hotspots to layers */}
      {React.Children.map(children, (child) => {
  if (!React.isValidElement(child)) return null;

  return React.cloneElement(child, {
    rainfall,
    hotspots,
  });
})}
    </MapContainer>
  );
}