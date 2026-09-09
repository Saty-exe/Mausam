import WeatherIcon from "./weatherIcon";
import { getWeatherInfo } from "../utils/weather";

/**
 * 7-day outlook list with a temperature range bar per day.
 *
 * @param {object} props
 * @param {object} props.daily - Open-Meteo `daily` payload
 */
function DailyForecast({ daily }) {
  if (!daily || !Array.isArray(daily.time)) return null;

  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const weekRange = weekMax - weekMin || 1;

  const formatDay = (isoString, index) => {
    if (index === 0) return "Today";
    return new Date(isoString).toLocaleDateString([], { weekday: "short" });
  };

  const formatClock = (isoString) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <section className="section">
      <h2 className="section-heading">7-day outlook</h2>
      <div className="daily-list">
        {daily.time.map((date, index) => {
          const info = getWeatherInfo(daily.weather_code[index]);
          const min = daily.temperature_2m_min[index];
          const max = daily.temperature_2m_max[index];
          const barStart = ((min - weekMin) / weekRange) * 100;
          const barWidth = ((max - min) / weekRange) * 100;

          return (
            <div className="day-row" key={date}>
              <div className="day-main">
                <span className="day-name">{formatDay(date, index)}</span>
                <WeatherIcon icon={info.icon} className="day-icon" />
                <span className="day-min">{Math.round(min)}&deg;</span>
                <div className="day-bar-track">
                  <div
                    className="day-bar-fill"
                    style={{ left: `${barStart}%`, width: `${barWidth}%` }}
                  />
                </div>
                <span className="day-max">{Math.round(max)}&deg;</span>
              </div>
              <div className="day-meta">
                <span>{daily.precipitation_probability_max[index]}% rain</span>
                <span>Sunrise {formatClock(daily.sunrise[index])}</span>
                <span>Sunset {formatClock(daily.sunset[index])}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DailyForecast;
