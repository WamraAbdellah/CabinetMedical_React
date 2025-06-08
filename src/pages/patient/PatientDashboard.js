import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI, doctorAPI } from '../../services/api';
import { Calendar, User, Clock, Plus, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
export default function PatientDashboard() {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState([]);
    const [doctor, setDoctor] = useState(null);
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
            // Load consultations
            const consultationsRes = await patientAPI.getConsultations(user._id);
            setConsultations(consultationsRes.data.consultations || []);
            // Load assigned doctor
            try {
                const doctorRes = await patientAPI.getDoctor(user._id);
                // Vérifiez si la réponse contient un message "Aucun docteur assigné"
                if (doctorRes.data.message && doctorRes.data.message === "Aucun docteur assigné") {
                    setDoctor(null);
                }
                else {
                    setDoctor(doctorRes.data);
                }
            }
            catch (error) {
                // En cas d'erreur autre que 200 (au cas où)
                setDoctor(null);
            }
            // Load all doctors for consultation booking
            const doctorsRes = await doctorAPI.list();
            setDoctors(doctorsRes.data.doctors || []);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des données');
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
            await patientAPI.createConsultation(user._id, newConsultation);
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
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Tableau de bord patient" }), _jsxs("p", { className: "text-medical-600", children: ["Bienvenue, ", user?.prenom, " ", user?.nom] })] }), _jsxs("button", { onClick: () => setShowNewConsultation(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Nouvelle consultation" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Consultations" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: consultations.length })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(Stethoscope, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "M\u00E9decin assign\u00E9" }), _jsx("p", { className: "text-lg font-semibold text-medical-900", children: doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Aucun' })] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "En attente" }), _jsx("p", { className: "text-2xl font-bold text-medical-900", children: consultations.filter(c => c.etat === 'demandée').length })] })] }) })] }), doctor && (_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Mon m\u00E9decin" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center", children: _jsx(User, { className: "h-8 w-8 text-primary-600" }) }), _jsxs("div", { children: [_jsxs("h4", { className: "text-lg font-medium text-medical-900", children: ["Dr. ", doctor.prenom, " ", doctor.nom] }), _jsx("p", { className: "text-medical-600", children: doctor.specialite }), _jsx("p", { className: "text-sm text-medical-500", children: doctor.email })] })] })] })), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Mes consultations r\u00E9centes" }), consultations.length === 0 ? (_jsx("p", { className: "text-medical-600 text-center py-8", children: "Aucune consultation pour le moment" })) : (_jsx("div", { className: "space-y-4", children: consultations.slice(0, 5).map((consultation) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-medical-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-medical-900", children: consultation.date }), _jsx("p", { className: "text-sm text-medical-600", children: consultation.description || 'Consultation générale' })] }), _jsx("span", { className: `status-badge ${getStatusColor(consultation.etat)}`, children: consultation.etat })] }, consultation._id))) }))] }), showNewConsultation && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 w-full max-w-md", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Nouvelle consultation" }), _jsxs("form", { onSubmit: handleCreateConsultation, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "M\u00E9decin" }), _jsxs("select", { value: newConsultation.doctor_id, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                doctor_id: e.target.value
                                            }), className: "input-field", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un m\u00E9decin" }), doctors.map((doc) => (_jsxs("option", { value: doc._id, children: ["Dr. ", doc.prenom, " ", doc.nom, " - ", doc.specialite] }, doc._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Date et heure" }), _jsx("input", { type: "datetime-local", value: newConsultation.date, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                date: e.target.value
                                            }), className: "input-field", required: true, min: new Date().toISOString().slice(0, 16) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Description (optionnel)" }), _jsx("textarea", { value: newConsultation.description, onChange: (e) => setNewConsultation({
                                                ...newConsultation,
                                                description: e.target.value
                                            }), className: "input-field", rows: 3, placeholder: "D\u00E9crivez bri\u00E8vement le motif de consultation..." })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowNewConsultation(false), className: "btn-secondary flex-1", children: "Annuler" }), _jsx("button", { type: "submit", className: "btn-primary flex-1", children: "Demander" })] })] })] }) }))] }));
}
