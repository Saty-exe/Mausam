import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setName,
  setInterests,
  setLocation,
  completeOnboarding,
} from "../features/preferences/preferenceSlice";
import { useNavigate } from "react-router-dom";
import { getCurrentPosition } from "../utils/geolocation";

export default function Onboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate(null);
  const [name, setNames] = useState("");
  const [city, setCity] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [interest, setInterest] = useState([]);
  const [locating, setLocating] = useState(false);

  const getLocation = () => {
    setLocating(true);
    getCurrentPosition()
      .then((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocating(false);
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
        setLocating(false);
      });
  };

  const handleInterest = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setInterest((prev) => [...prev, value]);
    } else {
      setInterest((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleAdd = () => {
    dispatch(setName(name));
    dispatch(setInterests(interest));
    dispatch(
      setLocation({
        city: city,
        latitude: latitude ? Number(latitude) : 28.6139,
        longitude: longitude ? Number(longitude) : 77.209,
      }),
    );
    dispatch(completeOnboarding());
    navigate("/");
  };

  const interestOptions = [
    { id: "health", label: "Health & Allergy" },
    { id: "fitness", label: "Outdoor Fitness" },
    { id: "travel", label: "Travel & Commute" },
    { id: "family", label: "Family Activities" },
    { id: "agriculture", label: "Gardening & Farming" },
    { id: "commute", label: "Daily Transit" },
    { id: "beach", label: "Outdoor Sports" },
    { id: "events", label: "Events & Festivals" },
  ];

  return (
    <div className="weather-page onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <span className="onboarding-badge">Mausam App</span>
          <h1 className="onboarding-title">Welcome to Mausam</h1>
          <p className="onboarding-subtitle">
            Personalize your local forecast, air quality insights, and weather
            alerts.
          </p>
        </div>

        <div className="onboarding-body">
          <div className="form-group">
            <label htmlFor="name-input" className="form-label">
              Your Name
            </label>
            <input
              id="name-input"
              className="form-input"
              type="text"
              placeholder="e.g. Pragya"
              value={name}
              onChange={(e) => setNames(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city-input" className="form-label">
              City / Region
            </label>
            <input
              id="city-input"
              className="form-input"
              type="text"
              placeholder="e.g. Delhi, Mumbai, Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="location-action-row">
            <button
              type="button"
              className="location-btn"
              onClick={getLocation}
              disabled={locating}
            >
              {locating
                ? "📍 Detecting location..."
                : "📍 Use My Current Location"}
            </button>
            {latitude && longitude && (
              <div className="location-coords-badge">
                <span>Lat: {Number(latitude).toFixed(3)}°</span>
                <span>Lon: {Number(longitude).toFixed(3)}°</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Your Interests & Activities</label>
            <div className="interests-grid">
              {interestOptions.map((opt) => {
                const isChecked = interest.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`interest-chip ${isChecked ? "active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      value={opt.id}
                      checked={isChecked}
                      onChange={handleInterest}
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button type="button" className="continue-btn" onClick={handleAdd}>
            Continue to Forecast &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
