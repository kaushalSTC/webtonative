import { Outlet, useLocation } from "react-router-dom";
import ComingSoon from "../pages/ComingSoon";
import usePageTracking from '../hooks/usePageTracking';

const ComingSoonLayout = () => {
  usePageTracking(); // Add page tracking
  const location = useLocation(); // Get current path

  return (
    <main className="w-screen h-screen">
      {/* Render ComingSoon only when the user is on "/" */}
      {location.pathname === "/" ? <ComingSoon /> : <Outlet />}
    </main>
  );
};

export default ComingSoonLayout;
