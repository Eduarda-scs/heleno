import { Navigate } from "react-router-dom";
import { useAuth } from "@/authProvider";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // ou um spinner

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
