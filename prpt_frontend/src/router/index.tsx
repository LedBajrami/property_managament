import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Auth/Login';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import Dashboard from '@/pages/Dashboard/Dashborad.tsx';
// import AdminPage from '../pages/Admin';
// import UserPage from '../pages/User';

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
                path: '/dashboard',
                element: (
                    <ProtectedRoute>
                         <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin',
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <div>Admin Page - Admin Only</div>
                        {/* <AdminPage /> */}
                    </ProtectedRoute>
                ),
            },
            {
                path: '/manager',
                element: (
                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <div>Manager Page - Admin & Manager Only</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: '/user',
                element: (
                    <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
                        <div>User Page - All Roles</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <div>404 - Page Not Found</div>,
            },
        ],
    },
]);