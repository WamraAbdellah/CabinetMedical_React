import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { Users, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
export default function DoctorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        patients: 0,
        consultations: 0,
        pending: 0,
        today: 0
    });
    const [pendingConsultations, setPendingConsultations] = useState([]);
    const [recentConsultations, setRecentConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, [user]);
    const loadData = async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const [patientsRes, consultationsRes, pendingRes] = await Promise.all([
                doctorAPI.getPatients(user._id),
                doctorAPI.getConsultations(user._id),
                doctorAPI.getPendingConsultations(user._id)
            ]);
            const patients = patientsRes.data.patients || [];
            const consultations = consultationsRes.data.consultations || [];
            const pending = pendingRes.data.consultations || [];
            // Calculate today's consultations
            const today = new Date().toISOString().split('T')[0];
            const todayConsultations = consultations.filter((c) => c.date && c.date.startsWith(today));
            setStats({
                patients: patients.length,
                consultations: consultations.length,
                pending: pending.length,
                today: todayConsultations.length
            });
            setPendingConsultations(pending.slice(0, 5));
            setRecentConsultations(consultations.slice(0, 5));
        }
        catch (error) {
            toast.error('Erreur lors du chargement des données');
        }
        finally {
            setLoading(false);
        }
    };
    const handleConsultationAction = async (consultationId, action) => {
        if (!user)
            return;
        try {
            if (action === 'accept') {
                await doctorAPI.acceptConsultation(user._id, consultationId);
                toast.success('Consultation acceptée');
            }
            else {
                await doctorAPI.rejectConsultation(user._id, consultationId);
                toast.success('Consultation rejetée');
            }
            loadData(); // Reload data
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de l\'action';
            toast.error(message);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'demandée': return 'status-pending';
            case 'acceptée': return 'status-accepted';
            case 'rejetée': return 'status-rejected';
            case 'terminée': return 'status-completed';
            default: return 'status-pending';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Tableau de bord m\u00E9decin" }), _jsxs("p", { className: "text-medical-600", children: ["Bienvenue, Dr. ", user?.prenom, " ", user?.nom] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Patients" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.patients })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Consultations" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.consultations })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "En attente" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.pending })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-6 w-6 text-purple-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Aujourd'hui" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: stats.today })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Demandes en attente" }), pendingConsultations.length === 0 ? (_jsx("p", { className: "text-medical-600 text-center py-8", children: "Aucune demande en attente" })) : (_jsx("div", { className: "space-y-4", children: pendingConsultations.map((consultation) => (_jsxs("div", { className: "border border-medical-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium text-medical-900", children: ["Patient ID: ", consultation.patient_id] }), _jsx("p", { className: "text-sm text-medical-600", children: consultation.date })] }), _jsx("span", { className: `status-badge ${getStatusColor(consultation.etat)}`, children: consultation.etat })] }), consultation.description && (_jsx("p", { className: "text-sm text-medical-700 mb-3", children: consultation.description })), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: () => handleConsultationAction(consultation._id, 'accept'), className: "btn-primary flex items-center space-x-1 text-sm px-3 py-1.5", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Accepter" })] }), _jsxs("button", { onClick: () => handleConsultationAction(consultation._id, 'reject'), className: "btn-danger flex items-center space-x-1 text-sm px-3 py-1.5", children: [_jsx(XCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Rejeter" })] })] })] }, consultation._id))) }))] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Consultations r\u00E9centes" }), recentConsultations.length === 0 ? (_jsx("p", { className: "text-medical-600 text-center py-8", children: "Aucune consultation r\u00E9cente" })) : (_jsx("div", { className: "space-y-4", children: recentConsultations.map((consultation) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-medical-50 rounded-lg", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium text-medical-900", children: ["Patient ID: ", consultation.patient_id] }), _jsx("p", { className: "text-sm text-medical-600", children: consultation.date }), consultation.description && (_jsx("p", { className: "text-sm text-medical-700 mt-1", children: consultation.description }))] }), _jsx("span", { className: `status-badge ${getStatusColor(consultation.etat)}`, children: consultation.etat })] }, consultation._id))) }))] })] })] }));
}
