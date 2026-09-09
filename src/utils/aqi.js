// Utility functions for Air Quality Index (AQI) calculation and formatting
// Follows Central Pollution Control Board (CPCB) India National Air Quality Index (NAQI) standards

export const AQI_CATEGORIES = [
  {
    min: 0,
    max: 50,
    level: "Good",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    advisory: "Air quality is satisfactory and poses little or no risk to health.",
  },
  {
    min: 51,
    max: 100,
    level: "Satisfactory",
    color: "#84cc16",
    bgColor: "rgba(132, 204, 22, 0.15)",
    borderColor: "rgba(132, 204, 22, 0.3)",
    advisory: "Minor breathing discomfort may occur for sensitive people with respiratory issues.",
  },
  {
    min: 101,
    max: 200,
    level: "Moderate",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    borderColor: "rgba(234, 179, 8, 0.3)",
    advisory: "Breathing discomfort possible for children, elderly, and people with lungs or heart diseases.",
  },
  {
    min: 201,
    max: 300,
    level: "Poor",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    borderColor: "rgba(249, 115, 22, 0.3)",
    advisory: "Breathing discomfort to most people on prolonged outdoor exposure.",
  },
  {
    min: 301,
    max: 400,
    level: "Very Poor",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    advisory: "Respiratory illness likely on prolonged exposure. Avoid strenuous outdoor activities.",
  },
  {
    min: 401,
    max: 500,
    level: "Severe",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.15)",
    borderColor: "rgba(168, 85, 247, 0.3)",
    advisory: "Healthy individuals also affected; serious health impacts on those with existing conditions.",
  },
];

export function getAqiCategory(aqiValue) {
  const aqi = Math.max(0, Math.round(Number(aqiValue) || 0));
  for (const cat of AQI_CATEGORIES) {
    if (aqi <= cat.max) {
      return {
        ...cat,
        percentage: Math.min(100, Math.max(0, (aqi / 500) * 100)),
      };
    }
  }
  const last = AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
  return {
    ...last,
    percentage: 100,
  };
}

// CPCB Sub-index calculator for common pollutants
export function calcSubIndex(pollutantId, rawValue) {
  if (rawValue == null || rawValue === "NA" || isNaN(rawValue)) return null;
  const val = parseFloat(rawValue);
  const p = pollutantId.toUpperCase().replace(/[_.\s]/g, "");

  if (p === "PM25") {
    if (val <= 30) return (val / 30) * 50;
    if (val <= 60) return 50 + ((val - 30) / 30) * 50;
    if (val <= 90) return 100 + ((val - 60) / 30) * 100;
    if (val <= 120) return 200 + ((val - 90) / 30) * 100;
    if (val <= 250) return 300 + ((val - 120) / 130) * 100;
    return 400 + Math.min(100, ((val - 250) / 130) * 100);
  }

  if (p === "PM10") {
    if (val <= 50) return val;
    if (val <= 100) return val;
    if (val <= 250) return 100 + ((val - 100) / 150) * 100;
    if (val <= 350) return 200 + ((val - 250) / 100) * 100;
    if (val <= 430) return 300 + ((val - 350) / 80) * 100;
    return 400 + Math.min(100, ((val - 430) / 80) * 100);
  }

  if (p === "NO2" || p === "NITROGENDIOXIDE") {
    if (val <= 40) return (val / 40) * 50;
    if (val <= 80) return 50 + ((val - 40) / 40) * 50;
    if (val <= 180) return 100 + ((val - 80) / 100) * 100;
    if (val <= 280) return 200 + ((val - 180) / 100) * 100;
    if (val <= 400) return 300 + ((val - 280) / 120) * 100;
    return 400 + Math.min(100, ((val - 400) / 120) * 100);
  }

  if (p === "SO2" || p === "SULPHURDIOXIDE") {
    if (val <= 40) return (val / 40) * 50;
    if (val <= 80) return 50 + ((val - 40) / 40) * 50;
    if (val <= 380) return 100 + ((val - 80) / 300) * 100;
    return 200 + ((val - 380) / 420) * 100;
  }

  if (p === "CO" || p === "CARBONMONOXIDE") {
    // If value in µg/m³ (over 50), convert to mg/m³
    const mg = val > 50 ? val / 1000 : val;
    if (mg <= 1.0) return mg * 50;
    if (mg <= 2.0) return 50 + ((mg - 1.0) / 1.0) * 50;
    if (mg <= 10.0) return 100 + ((mg - 2.0) / 8.0) * 100;
    if (mg <= 17.0) return 200 + ((mg - 10.0) / 7.0) * 100;
    return 300 + Math.min(200, ((mg - 17.0) / 17.0) * 100);
  }

  if (p === "OZONE" || p === "O3") {
    if (val <= 50) return val;
    if (val <= 100) return val;
    if (val <= 168) return 100 + ((val - 100) / 68) * 100;
    if (val <= 208) return 200 + ((val - 168) / 40) * 100;
    return 300 + Math.min(200, ((val - 208) / 40) * 100);
  }

  if (p === "NH3" || p === "AMMONIA") {
    if (val <= 200) return (val / 200) * 50;
    if (val <= 400) return 50 + ((val - 200) / 200) * 50;
    if (val <= 800) return 100 + ((val - 400) / 400) * 100;
    return 200 + Math.min(200, ((val - 800) / 400) * 100);
  }

  return null;
}

const POLLUTANT_METADATA = {
  "PM2.5": { label: "PM 2.5", unit: "µg/m³", description: "Fine inhalable particles" },
  "PM10": { label: "PM 10", unit: "µg/m³", description: "Inhalable particulate matter" },
  "NO2": { label: "NO₂", unit: "µg/m³", description: "Nitrogen Dioxide" },
  "SO2": { label: "SO₂", unit: "µg/m³", description: "Sulphur Dioxide" },
  "CO": { label: "CO", unit: "mg/m³", description: "Carbon Monoxide" },
  "OZONE": { label: "Ozone (O₃)", unit: "µg/m³", description: "Surface level ozone" },
  "NH3": { label: "NH₃", unit: "µg/m³", description: "Ammonia" },
};

export function parseAirQualityData(rawData, fallbackCity = "") {
  if (!rawData) return null;

  // Case 1: data.gov.in format (records array)
  if (rawData.records && Array.isArray(rawData.records) && rawData.records.length > 0) {
    const records = rawData.records;
    const first = records[0];
    const city = first.city || rawData.city || fallbackCity;
    const station = first.station || "";
    const lastUpdate = first.last_update || "";

    // Group pollutant values by pollutant_id
    const pollutantGroups = {};
    records.forEach((r) => {
      const pid = r.pollutant_id;
      if (!pid) return;
      const normalizedKey = pid.toUpperCase().replace(/[_.\s]/g, "") === "PM25" ? "PM2.5" : pid.toUpperCase();
      const avg = parseFloat(r.avg_value);
      const min = parseFloat(r.min_value);
      const max = parseFloat(r.max_value);

      if (!isNaN(avg)) {
        if (!pollutantGroups[normalizedKey]) {
          pollutantGroups[normalizedKey] = {
            id: normalizedKey,
            avgs: [],
            mins: [],
            maxs: [],
            unit: normalizedKey === "CO" ? "mg/m³" : "µg/m³",
          };
        }
        pollutantGroups[normalizedKey].avgs.push(avg);
        if (!isNaN(min)) pollutantGroups[normalizedKey].mins.push(min);
        if (!isNaN(max)) pollutantGroups[normalizedKey].maxs.push(max);
      }
    });

    let maxSubIndex = 0;
    let dominantPollutant = "PM2.5";
    const pollutants = [];

    const desiredOrder = ["PM2.5", "PM10", "NO2", "SO2", "CO", "OZONE", "NH3"];
    const presentKeys = Object.keys(pollutantGroups);
    const sortedKeys = desiredOrder.filter((k) => presentKeys.includes(k)).concat(
      presentKeys.filter((k) => !desiredOrder.includes(k))
    );

    sortedKeys.forEach((key) => {
      const grp = pollutantGroups[key];
      const avgVal = grp.avgs.reduce((a, b) => a + b, 0) / grp.avgs.length;
      const minVal = grp.mins.length ? Math.min(...grp.mins) : null;
      const maxVal = grp.maxs.length ? Math.max(...grp.maxs) : null;

      const subIdx = calcSubIndex(key, avgVal);
      if (subIdx != null && subIdx > maxSubIndex) {
        maxSubIndex = subIdx;
        dominantPollutant = key;
      }

      const meta = POLLUTANT_METADATA[key] || {
        label: key,
        unit: grp.unit,
        description: "",
      };

      const polCategory = subIdx != null ? getAqiCategory(subIdx) : null;

      pollutants.push({
        id: key,
        label: meta.label,
        value: Number(avgVal.toFixed(1)),
        min: minVal != null ? Number(minVal.toFixed(1)) : null,
        max: maxVal != null ? Number(maxVal.toFixed(1)) : null,
        unit: meta.unit,
        description: meta.description,
        subIndex: subIdx != null ? Math.round(subIdx) : null,
        status: polCategory ? polCategory.level : "Normal",
        color: polCategory ? polCategory.color : "#4c7daa",
      });
    });

    const calculatedAqi = Math.round(maxSubIndex) || 50;
    const category = getAqiCategory(calculatedAqi);

    return {
      aqi: calculatedAqi,
      category,
      dominantPollutant,
      station,
      city,
      lastUpdate,
      source: "CPCB (data.gov.in)",
      pollutants,
    };
  }

  // Case 2: Open-Meteo Air Quality format (current object)
  if (rawData.current) {
    const cur = rawData.current;
    const aqiVal = cur.us_aqi ?? cur.european_aqi ?? 50;
    const category = getAqiCategory(aqiVal);

    const pollutantMapping = [
      { id: "PM2.5", key: "pm2_5", label: "PM 2.5", unit: "µg/m³" },
      { id: "PM10", key: "pm10", label: "PM 10", unit: "µg/m³" },
      { id: "NO2", key: "nitrogen_dioxide", label: "NO₂", unit: "µg/m³" },
      { id: "SO2", key: "sulphur_dioxide", label: "SO₂", unit: "µg/m³" },
      { id: "CO", key: "carbon_monoxide", label: "CO", unit: "µg/m³" },
      { id: "OZONE", key: "ozone", label: "Ozone (O₃)", unit: "µg/m³" },
    ];

    const pollutants = [];
    pollutantMapping.forEach(({ id, key, label, unit }) => {
      const val = cur[key];
      if (val != null) {
        const subIdx = calcSubIndex(id, val);
        const polCategory = subIdx != null ? getAqiCategory(subIdx) : null;
        pollutants.push({
          id,
          label,
          value: Number(val.toFixed(1)),
          unit,
          description: POLLUTANT_METADATA[id]?.description || "",
          subIndex: subIdx != null ? Math.round(subIdx) : null,
          status: polCategory ? polCategory.level : "Normal",
          color: polCategory ? polCategory.color : "#4c7daa",
        });
      }
    });

    return {
      aqi: aqiVal,
      category,
      dominantPollutant: pollutants[0]?.label || "PM 2.5",
      station: null,
      city: rawData.city || fallbackCity || "Current Location",
      lastUpdate: cur.time ? new Date(cur.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Live",
      source: "Open-Meteo Air Quality",
      pollutants,
    };
  }

  return null;
}
