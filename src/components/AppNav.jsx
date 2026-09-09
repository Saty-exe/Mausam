import { NavLink } from "react-router-dom";

/**
 * Top navigation bar linking the main app sections.
 */
function AppNav() {
  return (
    <nav className="app-nav">
      <NavLink to="/home" className="app-nav-brand" end>
        Mausam
      </NavLink>
      <div className="app-nav-links">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `app-nav-link ${isActive ? "active" : ""}`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/forecast"
          className={({ isActive }) =>
            `app-nav-link ${isActive ? "active" : ""}`
          }
        >
          Forecast
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `app-nav-link ${isActive ? "active" : ""}`
          }
        >
          Alerts
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `app-nav-link ${isActive ? "active" : ""}`
          }
        >
          Settings
        </NavLink>
      </div>
    </nav>
  );
}

export default AppNav;
