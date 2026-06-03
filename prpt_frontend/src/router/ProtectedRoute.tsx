import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth.ts';
import { LoaderPinwheel } from "lucide-react"


interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoaderPinwheel
            className="animate-spin"
            style={{
                position: "absolute",
                top: '50%',
                right: '50%',
            }}
        />
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const hasMultipleCompanies = (user?.companies?.length ?? 0) > 1;
    const hasSelectedCompany = !!localStorage.getItem('current_company_id');

    if (hasMultipleCompanies && !hasSelectedCompany && location.pathname !== '/select-company') {
        return <Navigate to="/select-company" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // Redirect to dashboard if role not allowed
    }

    return <>{children}</>;
};

export default ProtectedRoute;
