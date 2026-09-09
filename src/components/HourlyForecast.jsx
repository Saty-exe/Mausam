import WeatherIcon from "./weatherIcon";
import { getWeatherInfo } from "../utils/weather";

/**
 * Horizontal always-scrollable strip of the next N hours.
 *
 * @param {object} props
 * @param {object} props.hourly       - Open-Meteo `hourly` payload
 * @param {number} [props.count=12]   - how many hours to render
 */
function HourlyForecast({ hourly, count = 12 }) {
  if (!hourly || !Array.isArray(hourly.time)) return null;

  const slice = hourly.time.slice(0, count);

  const formatHour = (isoString, index) => {
    if (index === 0) return "Now";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "numeric" });
  };

  return (
    <section className="section">
      <h2 className="section-heading">Next {count} hours</h2>
      <div className="hourly-strip">
        {slice.map((time, index) => {
          const info = getWeatherInfo(hourly.weather_code[index]);
          return (
            <div className="hour-card" key={time}>
              <span className="hour-time">{formatHour(time, index)}</span>
              <WeatherIcon icon={info.icon} className="hour-icon" />
              <span className="hour-temp">
                {Math.round(hourly.temperature_2m[index])}&deg;
              </span>
              <span className="hour-rain">
                {hourly.precipitation_probability[index]}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HourlyForecast;
