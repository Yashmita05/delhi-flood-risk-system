import { useEffect, useState } from "react";

import {
  getDrainageData,
  getFloodRiskData,
  getGovernmentPlan,
  getHotspots,
  getRainfallData,
} from "../services/csvService";

export default function useDashboardData() {
  const [loading, setLoading] = useState(true);

  const [hotspots, setHotspots] = useState([]);
  const [drainage, setDrainage] = useState([]);
  const [rainfall, setRainfall] = useState([]);
  const [floodRisk, setFloodRisk] = useState([]);
  const [govPlan, setGovPlan] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          hotspotData,
          drainageData,
          rainfallData,
          floodRiskData,
          govtData,
        ] = await Promise.all([
          getHotspots(),
          getDrainageData(),
          getRainfallData(),
          getFloodRiskData(),
          getGovernmentPlan(),
        ]);

        setHotspots(hotspotData);
        setDrainage(drainageData);
        setRainfall(rainfallData);
        setFloodRisk(floodRiskData);
        setGovPlan(govtData);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  return {
    loading,
    hotspots,
    drainage,
    rainfall,
    floodRisk,
    govPlan,
  };
}