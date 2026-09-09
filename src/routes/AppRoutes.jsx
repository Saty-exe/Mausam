import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Alerts from "../pages/Alerts";
import Forecast from "../pages/Forecast";
import Home from "../pages/Home";
import Onboarding from "../pages/Onboarding";
import Settings from "../pages/Settings";
import Welcome from "../pages/Welcome";

function RootRedirect() {
  const onboardingCompleted = useSelector(
    (state) => state.preference?.onboardingCompleted ?? false,
  );
  return <Navigate to={onboardingCompleted ? "/home" : "/welcome"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
