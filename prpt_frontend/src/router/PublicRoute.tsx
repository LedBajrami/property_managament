import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth.ts';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;