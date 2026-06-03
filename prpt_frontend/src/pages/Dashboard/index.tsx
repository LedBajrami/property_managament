import {useAuth} from "@/hooks/Auth/useAuth.ts";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import ResidentDashboard from "@/pages/Dashboard/ResidentDashboard";
import SuperAdminDashboard from "@/pages/Dashboard/SuperAdminDashboard";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'super-admin') return <SuperAdminDashboard />;
    if (user?.role === 'company-admin') return <AdminDashboard />;
    if (user?.role === 'property-manager') return <AdminDashboard />;
    if (user?.role === 'resident') return <ResidentDashboard />;
    if (user?.role === 'applicant') return <Navigate to="/browse" replace />;

    return <Navigate to="/browse" replace />;
}
