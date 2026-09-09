import WeatherIcon from "./weatherIcon";
import { getWeatherInfo } from "../utils/weather";

/**
 * Current conditions card.
 *
 * @param {object} props
 * @param {object} props.data      - Open-Meteo forecast payload (has `current`)
 * @param {string} props.locationLabel - display label for the location
 */
function WeatherCard({ data, locationLabel = "" }) {
  if (!data || !data.current) return null;

  const { current } = data;
  const info = getWeatherInfo(current.weather_code);

  return (
    <section className={`current-panel weather-card weather-card-${info.icon}`}>
      <div className="weather-atmosphere" aria-hidden="true">
        <span className="atmosphere-sun" />
        <span className="atmosphere-cloud atmosphere-cloud-one" />
        <span className="atmosphere-cloud atmosphere-cloud-two" />
        <span className="atmosphere-rain atmosphere-rain-one" />
        <span className="atmosphere-rain atmosphere-rain-two" />
        <span className="atmosphere-rain atmosphere-rain-three" />
      </div>
      <div className="current-top">
        <p className="current-location-label">{locationLabel}</p>
        <WeatherIcon icon={info.icon} className="current-icon" />
        <span className="current-condition">{info.label}</span>
      </div>

      <div className="current-temp">
        {Math.round(current.temperature_2m)}
        <span className="current-temp-unit">&deg;</span>
      </div>

      <p className="current-feels-like">
        Feels like {Math.round(current.apparent_temperature)}&deg;
      </p>

      <dl className="current-stats">
        <div className="current-stat">
          <dt>Humidity</dt>
          <dd>{current.relative_humidity_2m}%</dd>
        </div>
        <div className="current-stat">
          <dt>Wind</dt>
          <dd>{Math.round(current.wind_speed_10m)} km/h</dd>
        </div>
        <div className="current-stat">
          <dt>Precipitation</dt>
          <dd>{current.precipitation} mm</dd>
        </div>
        <div className="current-stat">
          <dt>Rain</dt>
          <dd>{current.rain} mm</dd>
        </div>
      </dl>
    </section>
  );
}

export default WeatherCard;
