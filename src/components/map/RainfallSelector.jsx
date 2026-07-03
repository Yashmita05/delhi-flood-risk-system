function RainfallSelector({ onChange }) {
  return (
    <select
      className="rainfall-selector"
      defaultValue="20"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="20">20 mm</option>
      <option value="50">50 mm</option>
      <option value="100">100 mm</option>
      <option value="real">Real Time</option>
    </select>
  );
}

export default RainfallSelector;