import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI, patientAPI } from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
export default function DoctorConsultations() {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        loadConsultations();
    }, [user]);
    const loadConsultations = async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const response = await doctorAPI.getConsultations(user._id);
            // Charger les informations des patients pour chaque consultation
            const consultationsWithPatientInfo = await Promise.all(response.data.consultations.map(async (consultation) => {
                try {
                    const patientResponse = await patientAPI.get(consultation.patient_id);
                    console.log(patientResponse);
                    return {
                        ...consultation,
                        patient_name: `${patientResponse.data.nom} ${patientResponse.data.prenom}`,
                        maladie: patientResponse.data.maladie || 'Non spécifiée'
                    };
                }
                catch (error) {
                    console.error("Erreur lors du chargement des informations du patient:", error);
                    return {
                        ...consultation,
                        patient_name: 'Patient inconnu',
                        maladie: 'Non spécifiée'
                    };
                }
            }));
            setConsultations(consultationsWithPatientInfo);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des consultations');
            console.error(error);
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
            loadConsultations(); // Recharger les données
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
    const getStatusText = (status) => {
        switch (status) {
            case 'demandée': return 'En attente';
            case 'acceptée': return 'Acceptée';
            case 'rejetée': return 'Rejetée';
            case 'terminée': return 'Terminée';
            default: return status;
        }
    };
    const filteredConsultations = consultations.filter((consultation) => {
        if (filter === 'all')
            return true;
        return consultation.etat === filter;
    });
    const stats = {
        total: consultations.length,
        pending: consultations.filter((c) => c.etat === 'demandée').length,
        accepted: consultations.filter((c) => c.etat === 'acceptée').length,
        completed: consultations.filter((c) => c.etat === 'terminée').length
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Mes consultations" }), _jsx("p", { className: "text-medical-600", children: "G\u00E9rez vos rendez-vous et demandes de consultation" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Total" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: stats.total })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-5 w-5 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "En attente" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: stats.pending })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Accept\u00E9es" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: stats.accepted })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Termin\u00E9es" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: stats.completed })] })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Filter, { className: "h-5 w-5 text-medical-600" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setFilter('all'), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-medical-600 hover:bg-medical-100'}`, children: "Toutes" }), _jsx("button", { onClick: () => setFilter('demandée'), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'demandée'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'text-medical-600 hover:bg-medical-100'}`, children: "En attente" }), _jsx("button", { onClick: () => setFilter('acceptée'), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'acceptée'
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-medical-600 hover:bg-medical-100'}`, children: "Accept\u00E9es" }), _jsx("button", { onClick: () => setFilter('terminée'), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'terminée'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-medical-600 hover:bg-medical-100'}`, children: "Termin\u00E9es" })] })] }) }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Liste des consultations" }), filteredConsultations.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Calendar, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: filter === 'all' ? 'Aucune consultation' : `Aucune consultation ${filter}` })] })) : (_jsx("div", { className: "space-y-4", children: filteredConsultations.map((consultation) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-4 hover:bg-medical-50 transition-colors", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-2", children: [_jsx("h4", { className: "font-medium text-medical-900", children: consultation.patient_name }), _jsx("span", { className: `status-badge ${getStatusColor(consultation.etat)}`, children: getStatusText(consultation.etat) })] }), _jsxs("div", { className: "flex flex-col space-y-2 text-sm text-medical-600 mb-2", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: consultation.date_str })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Maladie: " }), _jsx("span", { children: consultation.maladie })] })] }), consultation.description && (_jsxs("p", { className: "text-sm text-medical-700 mb-3", children: [_jsx("span", { className: "font-medium", children: "Motif: " }), consultation.description] })), consultation.etat === 'demandée' && (_jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: () => handleConsultationAction(consultation._id, 'accept'), className: "btn-primary flex items-center space-x-1 text-sm px-3 py-1.5", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Accepter" })] }), _jsxs("button", { onClick: () => handleConsultationAction(consultation._id, 'reject'), className: "btn-danger flex items-center space-x-1 text-sm px-3 py-1.5", children: [_jsx(XCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Rejeter" })] })] }))] }) }) }, consultation._id))) }))] })] }));
}
