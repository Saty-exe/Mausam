// Minimal single-color line icons, sized via CSS (width/height: 1em) so they
// inherit color and scale with font-size wherever they're placed.

function WeatherIcon({ icon, className = "" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `weather-icon ${className}`,
  };

  switch (icon) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg {...common}>
          <path d="M8.5 3.5v1.8M4 6.3l1.3 1.3M13 6.3l-1.3 1.3M3 10.5h1.8" />
          <circle cx="8.5" cy="9.3" r="3.2" />
          <path d="M7 18.5h10.5a3.5 3.5 0 0 0 0-7 4.8 4.8 0 0 0-9-1.7A3.8 3.8 0 0 0 7 18.5Z" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M6.5 18.5h11a3.8 3.8 0 0 0 0-7.6 5.2 5.2 0 0 0-10-1.6A4.2 4.2 0 0 0 6.5 18.5Z" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M6.5 10h11a3.5 3.5 0 0 0-6.8-1.4A4.2 4.2 0 0 0 6.5 10Z" />
          <path d="M4 14.5h16M4 18h16" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d="M6.5 12.5h11a3.5 3.5 0 0 0-6.8-1.4A4.2 4.2 0 0 0 6.5 12.5Z" />
          <path d="M9 17.5l-1 2M13 17.5l-1 2M17 17.5l-1 2" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M6.5 11.5h11a3.5 3.5 0 0 0-6.8-1.4A4.2 4.2 0 0 0 6.5 11.5Z" />
          <path d="M8.5 16l-1.5 3M13 16l-1.5 3M17.5 16 16 19" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M6.5 11h11a3.5 3.5 0 0 0-6.8-1.4A4.2 4.2 0 0 0 6.5 11Z" />
          <path d="M8 16.5v4M6 17.7l4 1.6M10 17.7l-4 1.6M16 16.5v4M14 17.7l4 1.6M18 17.7l-4 1.6" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M6.5 10.8h11a3.5 3.5 0 0 0-6.8-1.4A4.2 4.2 0 0 0 6.5 10.8Z" />
          <path
            d="M12.5 14.5 10 18.5h3l-1.5 4 4-5.5h-3l2-3Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export default WeatherIcon;
