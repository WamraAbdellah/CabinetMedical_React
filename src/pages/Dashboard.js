import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
export default function Dashboard() {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Redirect to role-specific dashboard
    switch (user.role) {
        case 'patient':
            return _jsx(Navigate, { to: "/patient/dashboard\\", replace: true });
        case 'doctor':
            return _jsx(Navigate, { to: "/doctor/dashboard", replace: true });
        case 'admin':
            return _jsx(Navigate, { to: "/admin/dashboard", replace: true });
        default:
            return _jsx(Navigate, { to: "/login", replace: true });
    }
}
