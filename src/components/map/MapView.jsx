import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState, Children, isValidElement, cloneElement } from "react";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import SpatialHUDOverlay from "./SpatialHUDOverlay";

function MapController({ searchText, selectedHotspot, hotspots }) {
  const map = useMap();

  // Search text flyTo
  useEffect(() => {
    if (!searchText) return;

    const match = hotspots.find(
      (h) => h.location?.toLowerCase() === searchText.toLowerCase()
    );

    if (match) {
      const lat = Number(match.latitude);
      const lng = Number(match.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 15, { duration: 1.5 });
      }
    }
  }, [searchText, hotspots, map]);

  // Selected hotspot flyTo
  useEffect(() => {
    if (!selectedHotspot?.latitude || !selectedHotspot?.longitude) return;

    const lat = Number(selectedHotspot.latitude);
    const lng = Number(selectedHotspot.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    }
  }, [selectedHotspot, map]);

  return null;
}

export default function MapView({
  children,
  searchText,
  setSearchText,
  rainfall,
  setRainfall,
  liveRain,
  layer,
  setLayer,
  selectedHotspot,
  setSelectedHotspot,
  drainageCount,
  avgPriority,
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
    <div className="spatial-map-container">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        zoomControl={false}
        className="spatial-leaflet-map"
        style={{ height: "100%", width: "100%" }}
      >
        {/* Free original OpenStreetMap tile layer (no subdomain to prevent DNS resolution errors) */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map Controller for programmatic flyTo */}
        <MapController
          searchText={searchText}
          selectedHotspot={selectedHotspot}
          hotspots={hotspots}
        />

        {/* Render child layers with props */}
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return null;
          return cloneElement(child, {
            rainfall,
            liveRain,
            hotspots,
            onSelectHotspot: (spot) => {
              setSelectedHotspot(spot);
            },
          });
        })}

        {/* Liquid Glass Spatial HUD Overlay */}
        <SpatialHUDOverlay
          layer={layer}
          setLayer={setLayer}
          rainfall={rainfall}
          setRainfall={setRainfall}
          liveRain={liveRain}
          hotspots={hotspots}
          drainageCount={drainageCount}
          avgPriority={avgPriority}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(spot) => setSelectedHotspot(spot)}
          onResetView={() => {
            setSelectedHotspot(null);
            if (setSearchText) setSearchText("");
          }}
        />
      </MapContainer>
    </div>
  );
}
