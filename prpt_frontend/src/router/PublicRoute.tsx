import { useAuth } from '../hooks/Auth/useAuth.ts';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default PublicRoute;