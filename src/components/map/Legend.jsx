function Legend() {
  return (
    <div className="legend">
      <h4>Map Legend</h4>

      <div className="legend-item">
        <span className="legend-color red"></span>
        High Flood Risk
      </div>

      <div className="legend-item">
        <span className="legend-color orange"></span>
        Medium Flood Risk
      </div>

      <div className="legend-item">
        <span className="legend-color green"></span>
        Low Flood Risk
      </div>
    </div>
  );
}

export default Legend;