import { useAuth } from '../hooks/Auth/useAuth.ts';
import {LoaderPinwheel} from "lucide-react";
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <LoaderPinwheel
            className="animate-spin"
            style={{
                position: "absolute",
                top: '50%',
                right: '50%',
            }}
        />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />; 
    }

    return <>{children}</>;
};

export default PublicRoute;