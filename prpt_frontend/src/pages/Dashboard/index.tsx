import {useAuth} from "@/hooks/Auth/useAuth.ts";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import ResidentDashboard from "@/pages/Dashboard/ResidentDashboard";
import SuperAdminDashboard from "@/pages/Dashboard/SuperAdminDashboard";

export const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'super-admin') return <SuperAdminDashboard />;
    if (user?.role === 'company-admin') return <AdminDashboard />;
    if (user?.role === 'resident') return <ResidentDashboard />;
}