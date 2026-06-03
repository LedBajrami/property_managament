import { useAuth } from '../hooks/Auth/useAuth.ts';
import {LoaderPinwheel} from "lucide-react";
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, isLoading, isAuthenticated } = useAuth();

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
        if (user?.role === "applicant") {
            return <Navigate to="/browse" replace />;
        }

        const hasMultipleCompanies = (user?.companies?.length ?? 0) > 1;
        const hasSelectedCompany = !!localStorage.getItem('current_company_id');

        return <Navigate to={hasMultipleCompanies && !hasSelectedCompany ? "/select-company" : "/dashboard"} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
