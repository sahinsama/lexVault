import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

function ProtectedRoute({ children }) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <p className="list-status">yükleniyor...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || !profile.username) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}

export default ProtectedRoute;