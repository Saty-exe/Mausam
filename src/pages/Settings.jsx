import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppNav from "../components/AppNav";
import LocationSelector from "../components/LocationSelector";
import InterestCard from "../components/InterestCard";
import {
  setName,
  setInterests,
  setLocation,
  resetPreferences,
} from "../features/preferences/preferenceSlice";
import { INTEREST_PROFILES_META } from "../features/personalization/personalization";
import { useNavigate } from "react-router-dom";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentName = useSelector((state) => state.preference?.name ?? "");
  const currentLocation = useSelector(
    (state) =>
      state.preference?.location ?? {
        city: "",
        latitude: null,
        longitude: null,
      },
  );
  const currentInterests = useSelector(
    (state) => state.preference?.interests ?? [],
  );

  const [name, setNameInput] = useState(currentName);
  const [location, setLocationInput] = useState(currentLocation);
  const [interests, setInterestsInput] = useState(currentInterests);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (id) => {
    setInterestsInput((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    setSaved(false);
  };

  const handleSave = () => {
    dispatch(setName(name));
    dispatch(setInterests(interests));
    dispatch(setLocation(location));
    setSaved(true);
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    setNameInput("");
    setLocationInput({ city: "", latitude: null, longitude: null });
    setInterestsInput([]);
    setSaved(false);
    navigate("/welcome");
  };

  const locationValid = location.latitude != null && location.longitude != null;

  return (
    <div className="weather-page">
      <AppNav />
      <section className="settings-card">
        <h1 className="settings-title">Settings</h1>

        <div className="form-group">
          <label htmlFor="settings-name" className="form-label">
            Your Name
          </label>
          <input
            id="settings-name"
            className="form-input"
            type="text"
            placeholder="e.g. Pragya"
            value={name}
            onChange={(e) => {
              setNameInput(e.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <LocationSelector
            value={location}
            onSelect={(loc) => {
              setLocationInput(loc);
              setSaved(false);
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Interests</label>
          <InterestCard
            options={INTEREST_PROFILES_META}
            selected={interests}
            onToggle={toggleInterest}
          />
        </div>

        <button
          type="button"
          className="continue-btn"
          onClick={handleSave}
          disabled={!locationValid}
        >
          Save changes
        </button>

        {saved && <p className="settings-saved">Preferences saved.</p>}

        <button
          type="button"
          className="settings-reset-btn"
          onClick={handleReset}
        >
          Reset preferences
        </button>
      </section>
    </div>
  );
}

export default Settings;
