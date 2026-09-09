import { useSelector } from "react-redux";
import AppNav from "../components/AppNav";
import WeatherAlert from "../components/WeatherAlert";
import WeatherIcon from "../components/weatherIcon";
import { useGetWeatherQuery } from "../api/weatherApi";
import { useGetAirQualityQuery } from "../api/airQuality";
import { parseAirQualityData } from "../utils/aqi";
import { getWeatherAlerts } from "../features/personalization/personalization";
import { Link } from "react-router-dom";

function Alerts() {
  const latitude = useSelector(
    (state) => state.preference?.location?.latitude ?? null,
  );
  const longitude = useSelector(
    (state) => state.preference?.location?.longitude ?? null,
  );
  const city = useSelector((state) => state.preference?.location?.city ?? null);
  const hasLocation = latitude != null && longitude != null;

  const { data, isLoading, error } = useGetWeatherQuery(
    { latitude, longitude },
    { skip: !hasLocation },
  );
  const { data: airQualityData } = useGetAirQualityQuery(
    { latitude, longitude, city },
    { skip: !hasLocation },
  );

  const alerts =
    data || airQualityData
      ? getWeatherAlerts({
          weather: data,
          airQuality: parseAirQualityData(airQualityData, city),
        })
      : [];

  if (!hasLocation) {
    return (
      <div className="weather-page">
        <AppNav />
        <div className="weather-state">
          <WeatherIcon icon="cloud" />
          <h1>No location set</h1>
          <p>Add a location in your preferences to see alerts.</p>
          <Link to="/settings" className="welcome-cta">
            Open settings
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="weather-page">
        <AppNav />
        <div className="weather-state">
          <div className="weather-spinner" aria-hidden="true" />
          <p>Checking for alerts&hellip;</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="weather-page">
        <AppNav />
        <div className="weather-state">
          <WeatherIcon icon="storm" />
          <h1>Couldn't load alerts</h1>
          <p>Check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-page">
      <AppNav />
      <section className="section">
        <h2 className="section-heading">Weather Alerts</h2>
        {alerts.length === 0 ? (
          <div className="alerts-empty">
            <WeatherIcon icon="sun" className="alerts-empty-icon" />
            <p>No active alerts for your area. Enjoy your day!</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <WeatherAlert key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Alerts;
