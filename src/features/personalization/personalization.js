// Personalization engine for Mausam.
//
// Turns raw weather + air-quality data into human-friendly,
// interest-aware recommendations and safety alerts.
//
// The engine reacts to the user's selected interests (set during onboarding
// and editable in Settings) plus the live weather / AQI conditions, and
// outputs structured cards the UI can render directly.

// ---------------------------------------------------------------------------
// Interest profiles
// ---------------------------------------------------------------------------
// Each profile maps a user interest ("health", "fitness", ...) to a set of
// rules that decide whether a recommendation should be shown and what it
// should say. Rules are evaluated from top to bottom; the first matching rule
// wins. Each rule can have an optional `when` predicate for fine-grained
// control and a `severity` that the UI uses to colour the card.

const INTEREST_PROFILES = {
  health: {
    label: "Health & Allergy",
    icon: "health",
    rules: [
      {
        id: "health-aqi-poor",
        when: ({ aqi }) => aqi.category && ["Poor", "Very Poor", "Severe"].includes(aqi.category.level),
        title: "Air quality is unhealthy",
        body: ({ aqi }) =>
          `The AQI is ${aqi.aqi} (${aqi.category.level}). Limit prolonged outdoor activity and keep windows closed.`,
        severity: "high",
      },
      {
        id: "health-aqi-moderate",
        when: ({ aqi }) => aqi.category && ["Moderate"].includes(aqi.category.level),
        title: "Sensitive groups be cautious",
        body: ({ aqi }) =>
          `AQI is ${aqi.aqi} (${aqi.category.level}). Children, the elderly and anyone with respiratory conditions should take it easy outdoors.`,
        severity: "medium",
      },
      {
        id: "health-high-uv",
        when: ({ uv }) => uv && uv > 6,
        title: "High UV — protect your skin",
        body: () => "Use SPF 30+, a hat and sunglasses when outdoors during midday.",
        severity: "medium",
      },
      {
        id: "health-humid",
        when: ({ current }) => current.relative_humidity_2m >= 75,
        title: "High humidity may trigger discomfort",
        body: () =>
          "Humidity is high. Stay hydrated and take breaks from heat if you are sensitive.",
        severity: "low",
      },
    ],
  },

  fitness: {
    label: "Outdoor Fitness",
    icon: "fitness",
    rules: [
      {
        id: "fitness-rain",
        when: ({ current, hourly }) => hasRain(current.weather_code) && nextHoursRainy(hourly),
        title: "Rain ahead — move the workout indoors",
        body: ({ hourly }) =>
          `Rain is expected within the next few hours (${hourlyRain(hourly)}). Consider a gym session or home workout.`,
        severity: "high",
      },
      {
        id: "fitness-aqi-poor",
        when: ({ aqi }) => aqi.category && ["Poor", "Very Poor", "Severe"].includes(aqi.category.level),
        title: "Skip the outdoor run today",
        body: ({ aqi }) =>
          `AQI ${aqi.aqi} (${aqi.category.level}) is poor for intense cardio. Choose an indoor routine instead.`,
        severity: "high",
      },
      {
        id: "fitness-hot",
        when: ({ current }) => current.temperature_2m >= 32,
        title: "Heat — hydrate before you head out",
        body: ({ current }) =>
          `It is ${Math.round(current.temperature_2m)}°C. Run early or late, and carry water.`,
        severity: "medium",
      },
      {
        id: "fitness-great",
        when: ({ current, aqi }) =>
          (!aqi.aqi || aqi.aqi <= 100) &&
          !hasRain(current.weather_code) &&
          current.temperature_2m < 32 &&
          current.wind_speed_10m < 25,
        title: "Perfect conditions to train outside",
        body: ({ current }) =>
          `${Math.round(current.temperature_2m)}°C and ${Math.round(current.wind_speed_10m)} km/h wind — ideal for a run, ride or walk.`,
        severity: "good",
      },
    ],
  },

  travel: {
    label: "Travel & Commute",
    icon: "travel",
    rules: [
      {
        id: "travel-storm",
        when: ({ current }) => isStorm(current.weather_code),
        title: "Thunderstorm — delay travel",
        body: () => "Thunderstorms are active. Avoid non-essential travel and stay indoors.",
        severity: "high",
      },
      {
        id: "travel-fog",
        when: ({ current }) => isFog(current.weather_code),
        title: "Low visibility for driving",
        body: () => "Fog reduces visibility. Drive slowly and use fog lights.",
        severity: "high",
      },
      {
        id: "travel-rain",
        when: ({ current, hourly }) => hasRain(current.weather_code) && nextHoursRainy(hourly),
        title: "Carry an umbrella",
        body: ({ hourly }) =>
          `Rain is likely in the next few hours (${hourlyRain(hourly)}). Keep rain gear handy.`,
        severity: "medium",
      },
      {
        id: "travel-windy",
        when: ({ current }) => current.wind_speed_10m >= 30,
        title: "Strong winds today",
        body: ({ current }) =>
          `Winds are ${Math.round(current.wind_speed_10m)} km/h. Watch out for flying debris on two-wheelers.`,
        severity: "medium",
      },
    ],
  },

  family: {
    label: "Family Activities",
    icon: "family",
    rules: [
      {
        id: "family-great",
        when: ({ current, aqi }) =>
          (!aqi.aqi || aqi.aqi <= 100) &&
          !hasRain(current.weather_code) &&
          current.temperature_2m >= 15 &&
          current.temperature_2m <= 30,
        title: "Great day for a family outing",
        body: () => "Pleasant weather — a good window for a picnic or park visit.",
        severity: "good",
      },
      {
        id: "family-storm",
        when: ({ current }) => isStorm(current.weather_code),
        title: "Keep kids indoors",
        body: () => "Thunderstorms are in the area. Choose an indoor activity today.",
        severity: "high",
      },
      {
        id: "family-heat",
        when: ({ current }) => current.temperature_2m >= 34,
        title: "Too hot for outdoor play",
        body: ({ current }) =>
          `It is ${Math.round(current.temperature_2m)}°C. Limit outdoor time and stay hydrated.`,
        severity: "medium",
      },
    ],
  },

  agriculture: {
    label: "Gardening & Farming",
    icon: "agriculture",
    rules: [
      {
        id: "agri-rain",
        when: ({ daily }) => daily && nextDaysRainy(daily),
        title: "Rain expected — hold off on watering",
        body: ({ daily }) =>
          `Rain is forecast on ${rainyDays(daily)}. Reduce irrigation and avoid spraying.`,
        severity: "medium",
      },
      {
        id: "agri-frost",
        when: ({ daily }) => daily && Math.min(...daily.temperature_2m_min) <= 4,
        title: "Frost risk — protect crops",
        body: () => "Low overnight temperatures may cause frost. Cover sensitive plants.",
        severity: "high",
      },
      {
        id: "agri-windy",
        when: ({ current }) => current.wind_speed_10m >= 30,
        title: "High wind — avoid spraying",
        body: ({ current }) =>
          `Winds are ${Math.round(current.wind_speed_10m)} km/h, which can drift chemicals. Wait for calmer conditions.`,
        severity: "medium",
      },
      {
        id: "agri-good",
        when: ({ current, daily }) =>
          !nextDaysRainy(daily) &&
          current.temperature_2m >= 10 &&
          current.temperature_2m <= 32 &&
          current.wind_speed_10m < 25,
        title: "Ideal conditions for field work",
        body: () => "Mild, dry and not too windy — a good window for sowing or harvesting.",
        severity: "good",
      },
    ],
  },

  commute: {
    label: "Daily Transit",
    icon: "commute",
    rules: [
      {
        id: "commute-rain-peak",
        when: ({ current, hourly }) => hasRain(current.weather_code) && nextHoursRainy(hourly),
        title: "Expect delays on your route",
        body: ({ hourly }) =>
          `Rain during the next few hours (${hourlyRain(hourly)}) may slow traffic and transit. Leave early.`,
        severity: "medium",
      },
      {
        id: "commute-fog",
        when: ({ current }) => isFog(current.weather_code),
        title: "Poor visibility on the commute",
        body: () => "Fog may delay flights and trains. Allow extra time on the road.",
        severity: "high",
      },
      {
        id: "commute-heat",
        when: ({ current }) => current.temperature_2m >= 33,
        title: "Heat advisory for commuting",
        body: () => "Carry water and, if possible, avoid the hottest hours for travel.",
        severity: "low",
      },
    ],
  },

  beach: {
    label: "Outdoor Sports",
    icon: "beach",
    rules: [
      {
        id: "beach-wind",
        when: ({ current }) => current.wind_speed_10m >= 35,
        title: "Strong winds — unsafe at the coast",
        body: ({ current }) =>
          `Winds are ${Math.round(current.wind_speed_10m)} km/h. Avoid water sports and open-seaside activity.`,
        severity: "high",
      },
      {
        id: "beach-rain",
        when: ({ current, hourly }) => hasRain(current.weather_code) && nextHoursRainy(hourly),
        title: "Rain — plan an indoor session",
        body: () => "Outdoor games are likely to be washed out. Pick an indoor alternative.",
        severity: "medium",
      },
      {
        id: "beach-good",
        when: ({ current }) =>
          !hasRain(current.weather_code) &&
          current.temperature_2m >= 18 &&
          current.wind_speed_10m < 30,
        title: "Good conditions for outdoor sports",
        body: () => "Mild and dry — a solid window for a match, ride or hike.",
        severity: "good",
      },
    ],
  },

  events: {
    label: "Events & Festivals",
    icon: "events",
    rules: [
      {
        id: "events-rain",
        when: ({ current, hourly }) => hasRain(current.weather_code) && nextHoursRainy(hourly),
        title: "Rain may affect the event",
        body: ({ hourly }) =>
          `Precipitation is likely in the next few hours (${hourlyRain(hourly)}). Keep a plan B for outdoor events.`,
        severity: "medium",
      },
      {
        id: "events-storm",
        when: ({ current }) => isStorm(current.weather_code),
        title: "Thunderstorm — outdoor events at risk",
        body: () => "Strong storms are active. Outdoor gatherings may be postponed.",
        severity: "high",
      },
      {
        id: "events-good",
        when: ({ current }) =>
          !hasRain(current.weather_code) &&
          current.temperature_2m >= 16 &&
          current.temperature_2m <= 30,
        title: "Nice evening for a festival",
        body: () => "Dry and comfortable — great weather for an outdoor celebration.",
        severity: "good",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isStorm(code) {
  return [95, 96, 99].includes(Number(code));
}

function isFog(code) {
  return [45, 48].includes(Number(code));
}

function hasRain(code) {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(Number(code));
}

function nextHoursRainy(hourly) {
  if (!hourly || !Array.isArray(hourly.precipitation_probability)) return false;
  return hourly.precipitation_probability.slice(0, 6).some((p) => (Number(p) || 0) >= 40);
}

function nextDaysRainy(daily) {
  if (!daily || !Array.isArray(daily.precipitation_probability_max)) return false;
  return daily.precipitation_probability_max.some((p) => (Number(p) || 0) >= 40);
}

function hourlyRain(hourly) {
  if (!hourly || !Array.isArray(hourly.time)) return "soon";
  const nextIndex = hourly.time.slice(0, 6).findIndex((_, i) => (Number(hourly.precipitation_probability?.[i]) || 0) >= 40);
  if (nextIndex === -1) return "soon";
  const d = new Date(hourly.time[nextIndex]);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function rainyDays(daily) {
  if (!daily || !Array.isArray(daily.time)) return "the coming days";
  const count = daily.time.filter((_, i) => (Number(daily.precipitation_probability_max?.[i]) || 0) >= 40).length;
  return `${count} day${count === 1 ? "" : "s"}`;
}

function currentUvIndex(current, hourly) {
  if (current && current.uv_index != null) return current.uv_index;
  if (hourly && Array.isArray(hourly.uv_index)) return Math.max(...hourly.uv_index.slice(0, 12).map((v) => Number(v) || 0));
  return null;
}

function getTemperatureRecommendation(current, name = "") {
  const temperature = Number(current?.temperature_2m);
  if (!Number.isFinite(temperature)) return null;

  const greeting = name ? `, ${name}` : "";

  if (temperature >= 35) {
    return {
      id: "weather-extreme-heat",
      interest: "weather",
      interestLabel: "Temperature care",
      icon: "sun",
      title: `Very hot today${greeting}`,
      body: `${Math.round(temperature)}°C is uncomfortable for long outdoor activity. Drink water often, use sun protection, and plan errands before 11am or after 4pm.`,
      severity: "high",
    };
  }

  if (temperature <= 10) {
    return {
      id: "weather-extreme-cold",
      interest: "weather",
      interestLabel: "Temperature care",
      icon: "snow",
      title: `Cold conditions today${greeting}`,
      body: `${Math.round(temperature)}°C calls for warm layers. Protect children, older adults, and sensitive plants from the cold, especially after sunset.`,
      severity: temperature <= 4 ? "high" : "medium",
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const INTEREST_PROFILES_META = Object.entries(INTEREST_PROFILES).map(
  ([id, profile]) => ({ id, label: profile.label, icon: profile.icon })
);

const personalization = {
  INTEREST_PROFILES_META,
  getRecommendationsForInterest,
  getPersonalizedRecommendations,
  getWeatherAlerts,
};

/**
 * Produce personalised recommendations for a given interest.
 *
 * @param {object} args
 * @param {string} args.interest  - one of the interest ids in INTEREST_PROFILES
 * @param {object} args.weather   - Open-Meteo forecast payload (current/hourly/daily)
 * @param {object} [args.airQuality] - parsed AQI payload from parseAirQualityData
 * @returns {Array<{id:string,title:string,body:string,severity:string}>}
 */
export function getRecommendationsForInterest({ interest, weather, airQuality }) {
  const profile = INTEREST_PROFILES[interest];
  if (!profile || !weather) return [];

  const current = weather.current || {};
  const hourly = weather.hourly || null;
  const daily = weather.daily || null;
  const uv = currentUvIndex(current, hourly);

  const context = {
    current,
    hourly,
    daily,
    aqi: airQuality || {},
    uv,
  };

  const results = [];
  for (const rule of profile.rules) {
    if (rule.when && !rule.when(context)) continue;
    results.push({
      id: rule.id,
      title: rule.title,
      body: rule.body(context),
      severity: rule.severity,
    });
    // Only surface the strongest matching recommendation per interest.
    if (results.length === 1) break;
  }

  return results;
}

/**
 * Aggregate recommendations across all of a user's interests.
 *
 * @param {object} args
 * @param {string[]} args.interests - list of interest ids
 * @param {object} args.weather     - Open-Meteo forecast payload
 * @param {object} [args.airQuality] - parsed AQI payload
 * @param {string} [args.name]      - user's name for personalisation
 * @returns {Array<{id:string,interest:string,interestLabel:string,icon:string,title:string,body:string,severity:string}>}
 */
export function getPersonalizedRecommendations({ interests = [], weather, airQuality, name = "" }) {
  if (!weather) return [];

  const seen = new Set();
  const recs = [];

  const temperatureRecommendation = getTemperatureRecommendation(weather.current, name);
  if (temperatureRecommendation) {
    seen.add(temperatureRecommendation.id);
    recs.push(temperatureRecommendation);
  }

  for (const interest of interests) {
    const profile = INTEREST_PROFILES[interest];
    if (!profile) continue;

    const matches = getRecommendationsForInterest({ interest, weather, airQuality });
    matches.forEach((match) => {
      if (seen.has(match.id)) return;
      seen.add(match.id);
      const greeting = name ? `, ${name}` : "";
      recs.push({
        ...match,
        interest,
        interestLabel: profile.label,
        icon: profile.icon,
        title: `${match.title}${greeting}`,
      });
    });
  }

  // Sort so high severity appears first, then "good" recommendations.
  const severityOrder = { high: 0, medium: 1, low: 2, good: 3 };
  return recs.sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));
}

/**
 * Build safety alerts from the forecast / AQI regardless of interests.
 *
 * @param {object} args
 * @param {object} args.weather   - Open-Meteo forecast payload
 * @param {object} [args.airQuality] - parsed AQI payload
 * @returns {Array<{id:string,title:string,body:string,severity:string,type:string}>}
 */
export function getWeatherAlerts({ weather, airQuality }) {
  if (!weather) return [];
  const current = weather.current || {};
  const daily = weather.daily || null;
  const alerts = [];

  if (isStorm(current.weather_code)) {
    alerts.push({
      id: "alert-storm",
      type: "Thunderstorm",
      title: "Thunderstorm warning",
      body: "Thunderstorms are active in your area. Move indoors and avoid exposed spaces.",
      severity: "high",
    });
  }

  if (isFog(current.weather_code)) {
    alerts.push({
      id: "alert-fog",
      type: "Fog",
      title: "Dense fog advisory",
      body: "Visibility is significantly reduced. Drive slowly and use fog lights.",
      severity: "high",
    });
  }

  if (daily && Math.min(...daily.temperature_2m_min) <= 4) {
    alerts.push({
      id: "alert-frost",
      type: "Cold",
      title: "Frost / cold night",
      body: "Temperatures are expected to fall sharply overnight. Dress warmly and protect tender plants.",
      severity: "medium",
    });
  }

  if (daily && Math.max(...daily.temperature_2m_max) >= 40) {
    alerts.push({
      id: "alert-heat",
      type: "Heatwave",
      title: "Heatwave alert",
      body: "Very high daytime temperatures are forecast. Avoid midday sun and stay hydrated.",
      severity: "high",
    });
  }

  if (airQuality && airQuality.aqi >= 200) {
    alerts.push({
      id: "alert-aqi",
      type: "Air Quality",
      title: "Severe air quality alert",
      body: `AQI is ${airQuality.aqi} (${airQuality.category?.level ?? "Severe"}). Minimise outdoor exposure.`,
      severity: "high",
    });
  }

  return alerts;
}

export default personalization;
