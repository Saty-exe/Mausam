import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WeatherIcon from "../components/weatherIcon";

const FEATURES = [
  {
    icon: "sun",
    title: "Live Forecast",
    text: "By-the-hour and 7-day weather tailored to you.",
  },
  {
    icon: "cloud",
    title: "Air Quality",
    text: "Real-time AQI from CPCB and Open-Meteo.",
  },
  {
    icon: "storm",
    title: "Smart Alerts",
    text: "Storm, heat, fog and pollution warnings.",
  },
  {
    icon: "cloud-sun",
    title: "Personalised",
    text: "Recommendations based on your interests.",
  },
];

function Welcome() {
  const onboardingCompleted = useSelector(
    (state) => state.preference?.onboardingCompleted ?? false,
  );

  return (
    <div className="weather-page welcome-page">
      <div className="welcome-sky" aria-hidden="true">
        <span className="welcome-sun" />
        <span className="welcome-cloud welcome-cloud-one" />
        <span className="welcome-cloud welcome-cloud-two" />
        <span className="welcome-breeze welcome-breeze-one" />
        <span className="welcome-breeze welcome-breeze-two" />
      </div>
      <section className="welcome-hero">
        <span className="welcome-badge">Smart India Hackathon 2026</span>
        <h1 className="welcome-title">Mausam</h1>
        <p className="welcome-subtitle">
          Your personal weather companion. Forecasts, air quality and alerts —
          tuned to your life and interests.
        </p>
        <Link
          to={onboardingCompleted ? "/home" : "/onboarding"}
          className="welcome-cta"
        >
          {onboardingCompleted ? "See my forecast" : "Get started"}
        </Link>
      </section>

      <section className="welcome-features">
        {FEATURES.map((f) => (
          <div className="welcome-feature" key={f.title}>
            <div className="welcome-feature-icon">
              <WeatherIcon icon={f.icon} />
            </div>
            <div>
              <h2 className="welcome-feature-title">{f.title}</h2>
              <p className="welcome-feature-text">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      <p className="welcome-footer">
        Built for SIH 26076 &middot; Personalised Weather Forecasting
      </p>
    </div>
  );
}

export default Welcome;
