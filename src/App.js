import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientSignup from './pages/PatientSignup';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import PatientConsultations from './pages/patient/PatientConsultations';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorConsultations from './pages/doctor/DoctorConsultations';
import AdminPatients from './pages/admin/AdminPatients';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPendingDoctors from './pages/admin/AdminPendingDoctors';
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/dashboard\\", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function AppRoutes() {
    const { user } = useAuth();
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: user ? _jsx(Navigate, { to: "/dashboard\\", replace: true }) : _jsx(Login, {}) }), _jsx(Route, { path: "/register/doctor", element: user ? _jsx(Navigate, { to: "/dashboard\\", replace: true }) : _jsx(Register, {}) }), _jsx(Route, { path: "/register/patient", element: user ? _jsx(Navigate, { to: "/dashboard\\", replace: true }) : _jsx(PatientSignup, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard\\", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsxs(Route, { path: "patient", children: [_jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['patient'], children: _jsx(PatientDashboard, {}) }) }), _jsx(Route, { path: "profile", element: _jsx(ProtectedRoute, { allowedRoles: ['patient'], children: _jsx(PatientProfile, {}) }) }), _jsx(Route, { path: "consultations", element: _jsx(ProtectedRoute, { allowedRoles: ['patient'], children: _jsx(PatientConsultations, {}) }) })] }), _jsxs(Route, { path: "doctor", children: [_jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['doctor'], children: _jsx(DoctorDashboard, {}) }) }), _jsx(Route, { path: "profile", element: _jsx(ProtectedRoute, { allowedRoles: ['doctor'], children: _jsx(DoctorProfile, {}) }) }), _jsx(Route, { path: "patients", element: _jsx(ProtectedRoute, { allowedRoles: ['doctor'], children: _jsx(DoctorPatients, {}) }) }), _jsx(Route, { path: "consultations", element: _jsx(ProtectedRoute, { allowedRoles: ['doctor'], children: _jsx(DoctorConsultations, {}) }) })] }), _jsxs(Route, { path: "admin", children: [_jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "patients", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminPatients, {}) }) }), _jsx(Route, { path: "doctors", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDoctors, {}) }) }), _jsx(Route, { path: "pending-doctors", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminPendingDoctors, {}) }) })] })] })] }));
}
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-medical-50", children: [_jsx(AppRoutes, {}), _jsx(Toaster, { position: "top-right", toastOptions: {
                            duration: 4000,
                            style: {
                                background: '#fff',
                                color: '#1e293b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                fontSize: '14px',
                                fontWeight: '500',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        } })] }) }) }));
}
export default App;
