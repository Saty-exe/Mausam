import { parseAirQualityData } from "../utils/aqi";

export default function AirQualityCard({ data, isLoading, error, fallbackCity = "" }) {
  if (isLoading) {
    return (
      <div className="aqi-card aqi-loading">
        <div className="weather-spinner" aria-hidden="true" />
        <p>Loading real-time air quality index&hellip;</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aqi-card aqi-state-msg">
        <p className="aqi-error-title">Air quality data currently unavailable</p>
        <p className="aqi-error-sub">Please check your network or try another city.</p>
      </div>
    );
  }

  const parsed = parseAirQualityData(data, fallbackCity);

  if (!parsed) {
    return (
      <div className="aqi-card aqi-state-msg">
        <p className="aqi-error-title">No air quality readings available</p>
        <p className="aqi-error-sub">No monitoring stations found for this location.</p>
      </div>
    );
  }

  const {
    aqi,
    category,
    dominantPollutant,
    station,
    city,
    lastUpdate,
    source,
    pollutants,
  } = parsed;

  return (
    <div className="aqi-card">
      {/* Header with location & timestamp */}
      <div className="aqi-header">
        <div className="aqi-header-info">
          <span className="aqi-live-badge">
            <span className="aqi-live-dot" /> LIVE
          </span>
          <span className="aqi-location-name">
            {station ? `${station}` : city}
          </span>
        </div>
        {lastUpdate && (
          <span className="aqi-timestamp">Updated {lastUpdate}</span>
        )}
      </div>

      {/* Hero Score Section */}
      <div className="aqi-hero">
        <div className="aqi-score-box">
          <div className="aqi-number" style={{ color: category.color }}>
            {aqi}
          </div>
          <div className="aqi-score-meta">
            <span className="aqi-label">AQI (US/CPCB)</span>
            <span
              className="aqi-status-pill"
              style={{
                backgroundColor: category.bgColor,
                borderColor: category.borderColor,
                color: category.color,
              }}
            >
              {category.level}
            </span>
          </div>
        </div>

        {dominantPollutant && (
          <div className="aqi-dominant">
            <span className="aqi-dominant-label">Primary Pollutant:</span>{" "}
            <strong>{dominantPollutant}</strong>
          </div>
        )}
      </div>

      {/* Spectrum / Gauge Bar */}
      <div className="aqi-spectrum-wrapper">
        <div className="aqi-spectrum-bar">
          <div
            className="aqi-needle"
            style={{
              left: `${category.percentage}%`,
              borderColor: category.color,
            }}
          />
        </div>
        <div className="aqi-spectrum-ticks">
          <span>0 Good</span>
          <span>50</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>500+</span>
        </div>
      </div>

      {/* Advisory Callout */}
      <div
        className="aqi-advisory"
        style={{
          borderLeftColor: category.color,
          backgroundColor: category.bgColor,
        }}
      >
        <span className="aqi-advisory-icon" style={{ color: category.color }}>
          ●
        </span>
        <p className="aqi-advisory-text">{category.advisory}</p>
      </div>

      {/* Pollutant Breakdown Grid */}
      {pollutants && pollutants.length > 0 && (
        <div className="aqi-pollutants-section">
          <h4 className="aqi-subheading">Pollutant Concentrations</h4>
          <div className="aqi-pollutants-grid">
            {pollutants.map((pol) => (
              <div className="aqi-pollutant-item" key={pol.id}>
                <div className="aqi-pollutant-top">
                  <span className="aqi-pollutant-name">{pol.label}</span>
                  <span
                    className="aqi-pollutant-status"
                    style={{ color: pol.color }}
                  >
                    {pol.status}
                  </span>
                </div>
                <div className="aqi-pollutant-val">
                  {pol.value}{" "}
                  <span className="aqi-pollutant-unit">{pol.unit}</span>
                </div>
                {(pol.min != null || pol.max != null) && (
                  <div className="aqi-pollutant-range">
                    Range: {pol.min ?? "-"} &ndash; {pol.max ?? "-"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source attribution */}
      {source && (
        <div className="aqi-footer">
          <span>Source: {source}</span>
        </div>
      )}
    </div>
  );
}
