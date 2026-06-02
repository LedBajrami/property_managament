import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Auth/Login';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RegisterCompany from "@/pages/Company/RegisterCompany/RegisterCompanyForm.tsx";
import { Dashboard } from "@/pages/Dashboard";
import TeamPage from "@/pages/Team";
import SetPassword from "@/pages/Auth/Password/SetPassword.tsx";
import ResidentsPage from "@/pages/Residents";
import { SelectCompany } from "@/pages/Company/SelectCompany.tsx";
import { Properties } from "@/pages/Properties";
import { PropertyDetails } from "@/pages/Properties/PropertyDetails";
import { Leases } from "@/pages/Leases";
import { UnitDetails } from "@/pages/Properties/Units/UnitDetails.tsx";
import ForgotPassword from "@/pages/Auth/Password/ForgotPassword.tsx";
import PaymentsPage from "@/pages/Payments";
import PaymentOverviewPage from "@/pages/Payments/PaymentsOverview";
import { LeaseDetail } from "@/pages/Leases/LeaseDetails";
import RegisterApplicant from "@/pages/Auth/RegisterApplicant";
import { LandingPage } from "@/pages/Public/LandingPage";
import { PropertiesPage } from "@/pages/Public/Property";
import { PropertyDetailPage } from "@/pages/Public/Property/PropertyDetails";
import { UnitDetailPage } from "@/pages/Public/Unit/UnitDetails";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [

            // ─── Public browsing (accessible by anyone: guests AND logged-in users) ──
            // These must come BEFORE the auth-gated /properties routes.
            {
                path: '/',
                element: <LandingPage />,
            },
            {
                path: '/browse',
                element: <PropertiesPage />,
            },
            {
                path: '/browse/:id',
                element: <PropertyDetailPage />,
            },
            {
                path: '/browse/:id/units/:unitId',
                element: <UnitDetailPage />,
            },

            // ─── Auth pages (guests only — redirect to /dashboard if logged in) ──────
            {
                path: '/login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: '/register-applicant',
                element: (
                    <PublicRoute>
                        <RegisterApplicant />
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
                path: '/forgot-password',
                element: (
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                ),
            },
            {
                path: '/register-company',
                element: (
                    <PublicRoute>
                        <RegisterCompany />
                    </PublicRoute>
                ),
            },

            // ─── Protected: Company ───────────────────────────────────────────────────
            {
                path: '/select-company',
                element: (
                    <ProtectedRoute>
                        <SelectCompany />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Dashboard ─────────────────────────────────────────────────
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Team ──────────────────────────────────────────────────────
            {
                path: '/team',
                element: (
                    <ProtectedRoute>
                        <TeamPage />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Residents ─────────────────────────────────────────────────
            {
                path: '/residents',
                element: (
                    <ProtectedRoute>
                        <ResidentsPage />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Properties (admin/manager internal views) ─────────────────
            {
                path: '/properties',
                element: (
                    <ProtectedRoute>
                        <Properties />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/properties/:id',
                element: (
                    <ProtectedRoute>
                        <PropertyDetails />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Units ─────────────────────────────────────────────────────
            {
                path: '/unit/:id/leases',
                element: (
                    <ProtectedRoute>
                        <UnitDetails />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Leases ────────────────────────────────────────────────────
            {
                path: '/leases',
                element: (
                    <ProtectedRoute>
                        <Leases />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/leases/:id',
                element: (
                    <ProtectedRoute>
                        <LeaseDetail />
                    </ProtectedRoute>
                ),
            },

            // ─── Protected: Payments ──────────────────────────────────────────────────
            {
                path: '/payments',
                element: (
                    <ProtectedRoute>
                        <PaymentsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/payments/overview',
                element: (
                    <ProtectedRoute>
                        <PaymentOverviewPage />
                    </ProtectedRoute>
                ),
            },

            // ─── 404 ──────────────────────────────────────────────────────────────────
            {
                path: '*',
                element: <div>404 - Page Not Found</div>,
            },
        ],
    },
]);