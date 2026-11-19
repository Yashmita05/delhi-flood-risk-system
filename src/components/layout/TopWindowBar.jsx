import { useState, useRef, useEffect } from "react";
import { LuSearch, LuDroplets, LuX, LuHouse, LuLayoutDashboard, LuInfo } from "react-icons/lu";

export default function TopWindowBar({
  activeTab = "dashboard",
  setActiveTab = () => {},
  searchText = "",
  onSearch = () => {},
  hotspots = [],
  onSelectLocation = () => {},
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredHotspots = searchText.trim()
    ? hotspots
        .filter((h) =>
          h.location?.toLowerCase().includes(searchText.toLowerCase()) ||
          h.area?.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 8)
    : [];

  function handleInputChange(e) {
    const val = e.target.value;
    onSearch(val);
    setDropdownOpen(true);
  }

  function handleSelect(locationName) {
    onSelectLocation(locationName);
    setDropdownOpen(false);
    if (activeTab !== "dashboard") {
      setActiveTab("dashboard");
    }
  }

  function handleClear() {
    onSearch("");
    setDropdownOpen(false);
  }

  return (
    <header className="spatial-top-bar" onMouseDown={(e) => e.stopPropagation()}>
      {/* Left: Circular Glass Icon Button + Translucent Search Pill */}
      <div className="top-bar-left">
        <button
          type="button"
          className="spatial-glass-icon-btn"
          title="Home"
          onClick={() => setActiveTab("home")}
        >
          <LuDroplets size={19} />
        </button>

        <div className="spatial-search-wrapper" ref={searchRef}>
          <div className="spatial-search-pill">
            <LuSearch size={15} className="search-icon-left" />
            <input
              type="text"
              className="spatial-search-input"
              placeholder="Search location..."
              value={searchText}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchText.trim()) setDropdownOpen(true);
              }}
            />
            {searchText && (
              <button
                type="button"
                className="spatial-search-clear"
                onClick={handleClear}
                title="Clear search"
              >
                <LuX size={14} />
              </button>
            )}
          </div>

          {/* Frosted Dropdown Autocomplete */}
          {dropdownOpen && filteredHotspots.length > 0 && (
            <div className="spatial-search-dropdown">
              {filteredHotspots.map((item, idx) => (
                <div
                  key={idx}
                  className="spatial-search-item"
                  onClick={() => handleSelect(item.location)}
                >
                  <div className="spatial-search-item-info">
                    <span className="spatial-search-item-title">{item.location}</span>
                    <span className="spatial-search-item-sub">{item.area || "NCT Delhi"}</span>
                  </div>
                  {item.recurrence_level && (
                    <span
                      className={`spatial-risk-pill-mini ${
                        item.recurrence_level.toLowerCase()
                      }`}
                    >
                      {item.recurrence_level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Crisp White Title */}
      <div
        className="spatial-window-title"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveTab("home")}
        title="Go to Home"
      >
        <span className="title-pulse-dot" />
        <span>Delhi Flood Risk System</span>
      </div>

      {/* Right: Translucent Pill Navigation Switcher */}
      <nav className="spatial-nav-switcher">
        <button
          type="button"
          className={`spatial-nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <LuHouse size={14} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`spatial-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LuLayoutDashboard size={14} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`spatial-nav-item ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <LuInfo size={14} />
          <span>About</span>
        </button>
      </nav>
    </header>
  );
}
