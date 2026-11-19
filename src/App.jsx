import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash === "home" || hash === "about") return hash;
    return "dashboard";
  });

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "home" || hash === "dashboard" || hash === "about") {
        setActiveTab(hash);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <Dashboard
      activeTab={activeTab}
      setActiveTab={handleTabChange}
    />
  );
}
