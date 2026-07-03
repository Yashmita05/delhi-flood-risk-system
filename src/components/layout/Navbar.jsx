import { FaWater, FaChartLine, FaHome, FaInfoCircle } from "react-icons/fa";

function Navbar() {
    function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
  return (
    <header className="navbar">
      <div className="logo">
        <FaWater className="logo-icon" />
        <h2>Delhi Flood Risk System</h2>
      </div>

      <nav>
        <ul className="nav-links">
          <li onClick={() => scrollToSection("dashboard")}>
  <FaHome />
  <span>Home</span>
</li>

<li onClick={() => scrollToSection("map")}>
  <FaChartLine />
  <span>Dashboard</span>
</li>

<li onClick={() => scrollToSection("about")}>
  <FaInfoCircle />
  <span>About</span>
</li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;