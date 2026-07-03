import { useState } from "react";

const locations = [
  "Minto Bridge Underpass",
  "Zakhira Flyover",
  "ITO Ring Road Crossing",
  "Dwarka Sector 21 Underpass",
  "Najafgarh Drain Road",
  "Anand Vihar ISBT Area",
  "Karol Bagh Faiz Road",
  "Patel Nagar Underpass",
];

function SearchBar({ onSearch }) {
  const [text, setText] = useState([]);
  const [value, setValue] = useState("");

  function handleChange(e) {
    const val = e.target.value;
    setValue(val);

    const filtered = locations.filter((l) =>
      l.toLowerCase().includes(val.toLowerCase())
    );

    setText(filtered);

    if (onSearch) onSearch(val);
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        className="search-input"
        placeholder="Search location..."
        value={value}
        onChange={handleChange}
      />

      {value && text.length > 0 && (
        <div
          style={{
            position: "absolute",
            background: "white",
            width: "100%",
            border: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          {text.map((t, i) => (
            <div
              key={i}
              style={{
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setValue(t);
                onSearch(t);
                setText([]);
              }}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;