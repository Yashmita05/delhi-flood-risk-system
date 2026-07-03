import Navbar from "../components/layout/Navbar";
import MapView from "../components/map/MapView";
import HotspotLayer from "../components/map/HotspotLayer";
import HeatmapLayer from "../components/map/HeatmapLayer";
import DrainageLayer from "../components/map/DrainageLayer";

export default function MapPage() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "25px",
          background: "#f4f7fb",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            color: "#073B4C",
            marginBottom: "20px",
          }}
        >
          Delhi Waterlogging Hotspots
        </h1>

       <MapView>
  <HeatmapLayer />
  <HotspotLayer />
  <DrainageLayer />
</MapView>
      </div>
    </>
  );
}