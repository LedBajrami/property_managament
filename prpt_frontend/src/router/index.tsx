import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Auth/Login';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RegisterCompany from "@/pages/Company/RegisterCompany/RegisterCompanyForm.tsx";
import { Dashboard } from "@/pages/Dashboard";
import TeamPage from "@/pages/Team";
import SetPassword from "@/pages/Auth/Password/SetPassword.tsx";
import ResidentsPage from "@/pages/Residents";
import {SelectCompany} from "@/pages/Company/SelectCompany.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: '/login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: '/reset-password-email/:id',
                element: (
                    <PublicRoute>
                        <SetPassword />
                    </PublicRoute>
                ),
            },
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute>
                         <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <div>404 - Page Not Found</div>,
            },

            // Company
            {
                path: '/register-company',
                element: (
                    <PublicRoute>
                        <RegisterCompany />
                    </PublicRoute>
                ),
            },
            {
                path: '/select-company',
                element: (
                    <ProtectedRoute>
                        <SelectCompany />
                    </ProtectedRoute>
                ),
            },

            // Team
            {
                path: '/team',
                element: (
                    <ProtectedRoute>
                        <TeamPage />
                    </ProtectedRoute>
                ),
            },

            // Residents
            {
                path: '/residents',
                element: (
                    <ProtectedRoute>
                        <ResidentsPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);