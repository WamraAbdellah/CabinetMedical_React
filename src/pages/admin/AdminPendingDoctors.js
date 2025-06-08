import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { Clock, Mail, Phone, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AdminPendingDoctors() {
    const { user } = useAuth();
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    useEffect(() => {
        loadPendingDoctors();
    }, []);
    const loadPendingDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPendingDoctors();
            setPendingDoctors(response.data || []);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des demandes');
        }
        finally {
            setLoading(false);
        }
    };
    const handleReviewDoctor = async (doctorId, action, reason) => {
        if (!user)
            return;
        setActionLoading(doctorId);
        try {
            await adminAPI.reviewDoctor(doctorId, {
                action,
                admin_id: user._id,
                reason: reason || ''
            });
            toast.success(action === 'approve'
                ? 'Médecin approuvé avec succès!'
                : 'Demande rejetée');
            loadPendingDoctors(); // Reload the list
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de l\'action';
            toast.error(message);
        }
        finally {
            setActionLoading(null);
        }
    };
    const handleReject = (doctorId) => {
        const reason = prompt('Raison du rejet (optionnel):');
        if (reason !== null) { // User didn't cancel
            handleReviewDoctor(doctorId, 'reject', reason);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Demandes d'acc\u00E8s m\u00E9decins" }), _jsx("p", { className: "text-medical-600", children: "Examinez et approuvez les demandes d'acc\u00E8s des m\u00E9decins" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "En attente" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: pendingDoctors.length })] })] })] }), _jsx("div", { className: "card", children: pendingDoctors.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Clock, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: "Aucune demande en attente" })] })) : (_jsx("div", { className: "space-y-6", children: pendingDoctors.map((doctor) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-6 bg-yellow-50", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Stethoscope, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "text-lg font-semibold text-medical-900", children: ["Dr. ", doctor.prenom, " ", doctor.nom] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800", children: "En attente" }), _jsx("span", { className: "text-sm text-medical-500", children: new Date(doctor.created_at.$date).toLocaleDateString() })] })] }), _jsx("div", { className: "mb-3", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: doctor.specialite }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: doctor.email })] }), doctor.tel && (_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Phone, { className: "h-4 w-4" }), _jsx("span", { children: doctor.tel })] }))] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => handleReviewDoctor(doctor._id, 'approve'), disabled: actionLoading === doctor._id, className: "btn-primary flex items-center space-x-2", children: actionLoading === doctor._id ? (_jsx("div", { className: "loading-spinner h-4 w-4" })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Approuver" })] })) }), _jsxs("button", { onClick: () => handleReject(doctor._id), disabled: actionLoading === doctor._id, className: "btn-danger flex items-center space-x-2", children: [_jsx(XCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Rejeter" })] })] })] })] }) }, doctor._id))) })) })] }));
}
