import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { Users, UserCheck, Clock, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        pendingDoctors: 0
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadStats();
    }, []);
    const loadStats = async () => {
        try {
            setLoading(true);
            const [patientsRes, doctorsRes, pendingRes] = await Promise.all([
                adminAPI.getAllPatients(),
                adminAPI.getAllDoctors(),
                adminAPI.getPendingDoctors()
            ]);
            setStats({
                patients: patientsRes.data.length || 0,
                doctors: doctorsRes.data.length || 0,
                pendingDoctors: pendingRes.data.length || 0
            });
        }
        catch (error) {
            toast.error('Erreur lors du chargement des statistiques');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Tableau de bord administrateur" }), _jsxs("p", { className: "text-medical-600", children: ["Bienvenue, ", user?.prenom, " ", user?.nom] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Patients" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.patients })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(UserCheck, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "M\u00E9decins" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.doctors })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Demandes en attente" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.pendingDoctors })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(Activity, { className: "h-6 w-6 text-purple-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Syst\u00E8me" }), _jsx("p", { className: "text-lg font-semibold text-green-600", children: "Actif" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "card hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Users, { className: "h-8 w-8 text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-2", children: "G\u00E9rer les patients" }), _jsx("p", { className: "text-medical-600 text-sm", children: "Voir et g\u00E9rer tous les patients enregistr\u00E9s" })] }) }), _jsx("div", { className: "card hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(UserCheck, { className: "h-8 w-8 text-green-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-2", children: "G\u00E9rer les m\u00E9decins" }), _jsx("p", { className: "text-medical-600 text-sm", children: "Voir et g\u00E9rer tous les m\u00E9decins approuv\u00E9s" })] }) }), _jsx("div", { className: "card hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Clock, { className: "h-8 w-8 text-yellow-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-2", children: "Demandes d'acc\u00E8s" }), _jsx("p", { className: "text-medical-600 text-sm", children: "Examiner les demandes d'acc\u00E8s des m\u00E9decins" }), stats.pendingDoctors > 0 && (_jsx("div", { className: "mt-2", children: _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800", children: [stats.pendingDoctors, " en attente"] }) }))] }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Activit\u00E9 r\u00E9cente" }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "flex items-center space-x-3 p-3 bg-medical-50 rounded-lg", children: [_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(UserCheck, { className: "h-4 w-4 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-medical-900", children: "Syst\u00E8me initialis\u00E9" }), _jsx("p", { className: "text-xs text-medical-600", children: "Le syst\u00E8me de gestion m\u00E9dicale est op\u00E9rationnel" })] })] }) })] })] }));
}
