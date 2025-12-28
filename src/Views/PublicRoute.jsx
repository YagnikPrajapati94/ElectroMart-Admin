import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, authChecking } = useAuth();

  if (authChecking) {
    return (
      <div className="app-loader">
        <div className="loader-content">
          <div className="spinner"></div>
          <h5 className="mt-4 TitleText fw-semibold">Loading Dashboard</h5>
          <p className="small SubtitleText">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // ✅ Already logged in → redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  // ❌ Not logged in → allow login page
  return children;
};

export default PublicRoute;
