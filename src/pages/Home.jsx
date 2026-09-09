import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetWeatherQuery } from "../api/weatherApi";
import { useGetAirQualityQuery } from "../api/airQuality";
import { useGetLocationQuery } from "../api/locationApi";
import { parseAirQualityData } from "../utils/aqi";
import { getPersonalizedRecommendations } from "../features/personalization/personalization";

import AppNav from "../components/AppNav";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import AirQualityCard from "../components/AirQualityCard";
import RecommendationCard from "../components/RecommendationCard";
import WeatherIcon from "../components/weatherIcon";

function Home() {
  const onboardingCompleted = useSelector(
    (state) => state.preference?.onboardingCompleted ?? false,
  );
  const latitude = useSelector(
    (state) => state.preference?.location?.latitude ?? null,
  );
  const longitude = useSelector(
    (state) => state.preference?.location?.longitude ?? null,
  );
  const city = useSelector((state) => state.preference?.location?.city ?? null);
  const interests = useSelector((state) => state.preference?.interests ?? []);
  const name = useSelector((state) => state.preference?.name ?? "");

  const hasLocation = latitude != null && longitude != null;

  const { data, isLoading, error } = useGetWeatherQuery(
    { latitude, longitude },
    { skip: !hasLocation },
  );
  const {
    data: airQualityData,
    isLoading: isAqLoading,
    error: aqError,
  } = useGetAirQualityQuery(
    { latitude, longitude, city },
    { skip: !hasLocation },
  );
  const { data: locationData, isLoading: isLocLoading } = useGetLocationQuery(
    { latitude, longitude },
    { skip: !hasLocation },
  );

  if (!onboardingCompleted) {
    return (
      <div className="weather-page">
        <div className="weather-state">
          <WeatherIcon icon="cloud" />
          <h1>Welcome to Mausam</h1>
          <p>Set up your profile to start seeing personalised weather.</p>
          <Link to="/welcome" className="welcome-cta">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  if (!hasLocation) {
    return (
      <div className="weather-page">
        <AppNav />
        <div className="weather-state">
          <WeatherIcon icon="cloud" />
          <h1>No location set</h1>
          <p>Add a location in your preferences to see the forecast.</p>
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
          <p>Loading forecast&hellip;</p>
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
          <h1>Couldn&rsquo;t load the forecast</h1>
          <p>Check your connection and try again.</p>
          <Link to="/settings" className="welcome-cta">
            Retry settings
          </Link>
        </div>
      </div>
    );
  }

  const locationLabel = isLocLoading
    ? "Locating…"
    : (locationData?.city ?? locationData?.name ?? city ?? "");

  const parsedAq = parseAirQualityData(airQualityData, city);
  const recommendations = getPersonalizedRecommendations({
    interests,
    weather: data,
    airQuality: parsedAq,
    name,
  });

  return (
    <div className="weather-page">
      <AppNav />
      <WeatherCard data={data} locationLabel={locationLabel} />

      {recommendations.length > 0 && (
        <section className="section">
          <h2 className="section-heading">For you</h2>
          <div className="rec-list">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      <HourlyForecast hourly={data.hourly} count={12} />

      <section className="section">
        <h2 className="section-heading">Air Quality</h2>
        <AirQualityCard
          data={airQualityData}
          isLoading={isAqLoading}
          error={aqError}
          fallbackCity={city}
        />
      </section>
    </div>
  );
}

export default Home;
