/**
 * A single alert banner.
 *
 * @param {object} props
 * @param {object} props.alert - alert from getWeatherAlerts()
 *   { id, type, title, body, severity }
 */
function WeatherAlert({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert-card alert-${alert.severity}`}>
      <div className="alert-card-top">
        <span className="alert-type">{alert.type}</span>
        <span className="alert-severity">{alert.severity}</span>
      </div>
      <h3 className="alert-title">{alert.title}</h3>
      <p className="alert-body">{alert.body}</p>
    </div>
  );
}

export default WeatherAlert;
