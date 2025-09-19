import {useAuth} from "@/hooks/Auth/useAuth.ts";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import ResidentDashboard from "@/pages/Dashboard/ResidentDashboard";

export const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'company-admin') return <AdminDashboard />;
    if (user?.role === 'resident') return <ResidentDashboard />;
}