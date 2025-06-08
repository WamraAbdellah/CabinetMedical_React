import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI, adminAPI } from '../../services/api';
import { Calendar, Clock, User, Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
export default function PatientConsultations() {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewConsultation, setShowNewConsultation] = useState(false);
    const [newConsultation, setNewConsultation] = useState({
        doctor_id: '',
        date: '',
        description: ''
    });
    useEffect(() => {
        loadData();
    }, [user]);
    const loadData = async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const [consultationsRes, doctorsRes] = await Promise.all([
                patientAPI.getConsultations(user._id),
                adminAPI.getAllDoctors()
            ]);
            console.log(doctorsRes);
            setConsultations(consultationsRes.data.consultations || []);
            setDoctors(doctorsRes.data || []);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des consultations');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCreateConsultation = async (e) => {
        e.preventDefault();
        if (!newConsultation.doctor_id || !newConsultation.date) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }
        try {
            // Convert datetime-local to the format expected by backend
            const formattedDate = new Date(newConsultation.date)
                .toISOString()
                .slice(0, 16)
                .replace('T', ' ');
            await patientAPI.createConsultation(user._id, {
                ...newConsultation,
                date: formattedDate
            });
            toast.success('Demande de consultation envoyée!');
            setShowNewConsultation(false);
            setNewConsultation({ doctor_id: '', date: '', description: '' });
            loadData();
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de la création';
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
    const getDoctorName = (doctorId) => {
        const doctor = doctors.find((d) => d._id === doctorId);
        return doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu';
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Mes consultations" }), _jsx("p", { className: "text-medical-600", children: "G\u00E9rez vos rendez-vous m\u00E9dicaux" })] }), _jsxs("button", { onClick: () => setShowNewConsultation(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Nouvelle consultation" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Total" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: consultations.length })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-5 w-5 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "En attente" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: consultations.filter((c) => c.etat === 'demandée').length })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(User, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Accept\u00E9es" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: consultations.filter((c) => c.etat === 'acceptée').length })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Termin\u00E9es" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: consultations.filter((c) => c.etat === 'terminée').length })] })] }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Historique des consultations" }), consultations.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Calendar, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: "Aucune consultation pour le moment" }), _jsx("button", { onClick: () => setShowNewConsultation(true), className: "btn-primary mt-4", children: "Planifier une consultation" })] })) : (_jsx("div", { className: "space-y-4", children: consultations.map((consultation) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-4 hover:bg-medical-50 transition-colors", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-2", children: [_jsx("h4", { className: "font-medium text-medical-900", children: getDoctorName(consultation.doctor_id) }), _jsx("span", { className: `status-badge ${getStatusColor(consultation.etat)}`, children: getStatusText(consultation.etat) })] }), _jsx("div", { className: "flex items-center space-x-4 text-sm text-medical-600", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: consultation.date_str })] }) }), consultation.description && (_jsx("p", { className: "mt-2 text-sm text-medical-700", children: consultation.description }))] }) }) }, consultation._id))) }))] }), showNewConsultation && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Nouvelle consultation" }), _jsxs("form", { onSubmit: handleCreateConsultation, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "M\u00E9decin *" }), _jsxs("select", { value: newConsultation.doctor_id, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                doctor_id: e.target.value
                                            }), className: "input-field", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un m\u00E9decin" }), doctors.map((doc) => (_jsxs("option", { value: doc._id, children: ["Dr. ", doc.prenom, " ", doc.nom, " - ", doc.specialite] }, doc._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Date et heure *" }), _jsx("input", { type: "datetime-local", value: newConsultation.date, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                date: e.target.value
                                            }), className: "input-field", required: true, min: new Date().toISOString().slice(0, 16) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Description (optionnel)" }), _jsx("textarea", { value: newConsultation.description, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                description: e.target.value
                                            }), className: "input-field", rows: 3, placeholder: "D\u00E9crivez bri\u00E8vement le motif de consultation..." })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: () => {
                                                setShowNewConsultation(false);
                                                setNewConsultation({ doctor_id: '', date: '', description: '' });
                                            }, className: "btn-secondary flex-1", children: "Annuler" }), _jsx("button", { type: "submit", className: "btn-primary flex-1", children: "Demander" })] })] })] }) }))] }));
}
