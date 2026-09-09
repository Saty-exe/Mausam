import WeatherIcon from "./weatherIcon";

function formatClock(value) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getUvLabel(value) {
  if (value >= 8) return "Very high";
  if (value >= 6) return "High";
  if (value >= 3) return "Moderate";
  return "Low";
}

function DaylightCard({ daily }) {
  if (!daily?.time?.length) return null;

  const uvIndex = daily.uv_index_max?.[0] ?? null;
  const daylightStart = daily.sunrise?.[0];
  const daylightEnd = daily.sunset?.[0];
  const daylightMinutes =
    daylightStart && daylightEnd
      ? Math.round((new Date(daylightEnd) - new Date(daylightStart)) / 60000)
      : null;
  const hours = daylightMinutes ? Math.floor(daylightMinutes / 60) : null;
  const minutes = daylightMinutes ? daylightMinutes % 60 : null;

  return (
    <section
      className="daylight-card"
      aria-label="Today's daylight and UV forecast"
    >
      <div className="daylight-heading">
        <div>
          <p className="eyebrow">Plan your day</p>
          <h2>Light &amp; UV</h2>
        </div>
        <WeatherIcon icon="sun" className="daylight-icon" />
      </div>

      <div className="daylight-grid">
        <div className="daylight-stat">
          <span className="daylight-stat-label">Sunrise</span>
          <strong>{formatClock(daylightStart)}</strong>
        </div>
        <div className="daylight-stat">
          <span className="daylight-stat-label">Sunset</span>
          <strong>{formatClock(daylightEnd)}</strong>
        </div>
        <div className="daylight-stat daylight-stat-wide">
          <span className="daylight-stat-label">Daylight</span>
          <strong>{hours != null ? `${hours}h ${minutes}m` : "--"}</strong>
        </div>
        <div className="daylight-stat daylight-stat-wide">
          <span className="daylight-stat-label">UV peak</span>
          <strong>
            {uvIndex != null
              ? `${Math.round(uvIndex)} · ${getUvLabel(uvIndex)}`
              : "--"}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default DaylightCard;
