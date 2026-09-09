import WeatherIcon from "./weatherIcon";

function formatVisibility(meters) {
  if (meters == null) return "--";
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function getWindDirection(degrees) {
  if (degrees == null) return "--";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % directions.length];
}

function AtmosphereCard({ current }) {
  if (!current) return null;

  const windDirection = getWindDirection(current.wind_direction_10m);
  const windGust = current.wind_gusts_10m;
  const cloudCover = current.cloud_cover;
  const pressure = current.pressure_msl;
  const dewPoint = current.dew_point_2m;

  return (
    <section className="atmosphere-card" aria-label="Atmospheric conditions">
      <div className="atmosphere-heading">
        <div>
          <p className="eyebrow">Live conditions</p>
          <h2>Atmosphere</h2>
        </div>
        <WeatherIcon icon="cloud" className="atmosphere-icon" />
      </div>

      <div className="atmosphere-grid">
        <div className="atmosphere-stat">
          <span>Cloud cover</span>
          <strong>{cloudCover != null ? `${cloudCover}%` : "--"}</strong>
        </div>
        <div className="atmosphere-stat">
          <span>Visibility</span>
          <strong>{formatVisibility(current.visibility)}</strong>
        </div>
        <div className="atmosphere-stat">
          <span>Pressure</span>
          <strong>
            {pressure != null ? `${Math.round(pressure)} hPa` : "--"}
          </strong>
        </div>
        <div className="atmosphere-stat">
          <span>Dew point</span>
          <strong>
            {dewPoint != null ? `${Math.round(dewPoint)}°` : "--"}
          </strong>
        </div>
      </div>

      <p className="atmosphere-footer">
        Wind {windDirection} at {Math.round(current.wind_speed_10m ?? 0)} km/h
        {windGust != null ? ` · gusts ${Math.round(windGust)} km/h` : ""}
      </p>
    </section>
  );
}

export default AtmosphereCard;
