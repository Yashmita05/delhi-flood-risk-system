import Papa from "papaparse";

function loadCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      download: true,
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        resolve(results.data);
      },

      error: (error) => {
        reject(error);
      },
    });
  });
}

export async function getHotspots() {
  return await loadCSV("/data/hotspots.csv");
}

export async function getDrainageData() {
  return await loadCSV("/data/delhi_drainage_dummy_dataset.csv");
}

export async function getRainfallData() {
  return await loadCSV("/data/delhi_rainfall_features.csv");
}

export async function getFloodRiskData() {
  return await loadCSV("/data/flood_risk_predictions.csv");
}

export async function getGovernmentPlan() {
  return await loadCSV("/data/govt_flood_action_plan.csv");
}