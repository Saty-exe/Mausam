import { useEffect, useState } from "react";
import { useGetCitySuggestionsQuery } from "../api/locationApi";
import { getCurrentPosition } from "../utils/geolocation";

/**
 * City search + geolocation picker.
 *
 * @param {object} props
 * @param {object} props.value - current location { city, latitude, longitude }
 * @param {(loc: {city:string,latitude:number,longitude:number}) => void} props.onSelect
 */
function LocationSelector({ value = {}, onSelect }) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [locating, setLocating] = useState(false);

  // Debounce the search term so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(timer);
  }, [term]);

  const { data, isFetching } = useGetCitySuggestionsQuery(
    { query: debounced },
    { skip: debounced.length < 2 },
  );

  const results = data?.results ?? [];

  const locationLabel = value.city
    ? value.city
    : value.latitude != null
    ? `${value.latitude.toFixed(2)}, ${value.longitude?.toFixed(2)}`
    : "Choose a city";

  const handleSelect = (result) => {
    onSelect?.({
      city: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setTerm("");
    setShowDropdown(false);
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    getCurrentPosition()
      .then(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const json = await res.json();
          onSelect?.({
            city: json.city || json.locality || "Current Location",
            latitude,
            longitude,
          });
        } catch {
          onSelect?.({ city: "Current Location", latitude, longitude });
        } finally {
          setLocating(false);
        }
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
        setLocating(false);
      });
  };

  return (
    <div className="location-selector">
      <div className="location-selector-input-wrap">
        <input
          className="form-input"
          type="text"
          placeholder="Search for a city…"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
        {isFetching && <span className="location-spinner" aria-hidden="true" />}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="location-suggestions">
          {results.map((r) => (
            <li key={`${r.latitude}-${r.longitude}`}>
              <button
                type="button"
                className="location-suggestion"
                onMouseDown={() => handleSelect(r)}
              >
                <span className="location-suggestion-name">{r.name}</span>
                {r.admin1 && (
                  <span className="location-suggestion-region">{r.admin1}</span>
                )}
                <span className="location-suggestion-country">{r.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="location-current">
        <span className="location-current-label">{locationLabel}</span>
        <button
          type="button"
          className="location-btn"
          onClick={handleUseCurrentLocation}
          disabled={locating}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          {locating ? "Detecting…" : "Use my current location"}
        </button>
      </div>
    </div>
  );
}

export default LocationSelector;
