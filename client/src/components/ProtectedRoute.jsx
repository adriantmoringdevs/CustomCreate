import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext"

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
}

