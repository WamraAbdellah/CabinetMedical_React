import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { adminAPI, patientAPI } from '../../services/api';
import { Users, User, Mail, Phone, Calendar, Search, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPatientId, setEditingPatientId] = useState(null);
    const [editedPatient, setEditedPatient] = useState({});
    useEffect(() => {
        loadPatients();
    }, []);
    const loadPatients = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllPatients();
            setPatients(response.data || []);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des patients');
        }
        finally {
            setLoading(false);
        }
    };
    const filteredPatients = patients.filter((patient) => `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleEdit = (patient) => {
        setEditingPatientId(patient._id);
        setEditedPatient({
            prenom: patient.prenom,
            nom: patient.nom,
            email: patient.email,
            tel: patient.tel || '',
            date_naissance: patient.date_naissance || '',
            maladie: patient.maladie || '',
            description_maladie: patient.description_maladie || '',
            doctor_id: patient.doctor_id || ''
        });
    };
    const handleCancelEdit = () => {
        setEditingPatientId(null);
        setEditedPatient({});
    };
    const handleSave = async (patientId) => {
        try {
            // Filtrer les champs vides pour ne pas envoyer de valeurs null
            const dataToSend = Object.fromEntries(Object.entries(editedPatient).filter(([_, v]) => v !== ''));
            await patientAPI.update(patientId, dataToSend);
            toast.success('Patient mis à jour avec succès');
            setEditingPatientId(null);
            loadPatients(); // Recharger la liste des patients
        }
        catch (error) {
            toast.error('Erreur lors de la mise à jour du patient');
            console.error('Update error:', error);
        }
    };
    const handleDelete = async (patientId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
            try {
                await patientAPI.delete(patientId);
                toast.success('Patient supprimé avec succès');
                loadPatients(); // Recharger la liste des patients
            }
            catch (error) {
                toast.error('Erreur lors de la suppression du patient');
                console.error('Delete error:', error);
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Gestion des patients" }), _jsx("p", { className: "text-medical-600", children: "Vue d'ensemble de tous les patients enregistr\u00E9s" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Total patients" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: patients.length })] })] })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Search, { className: "h-5 w-5 text-medical-400" }), _jsx("input", { type: "text", placeholder: "Rechercher un patient par nom ou email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "input-field flex-1" })] }) }), _jsx("div", { className: "card", children: filteredPatients.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré' })] })) : (_jsx("div", { className: "space-y-4", children: filteredPatients.map((patient) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-6 hover:bg-medical-50 transition-colors", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(User, { className: "h-6 w-6 text-primary-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [editingPatientId === patient._id ? (_jsxs("div", { className: "flex space-x-2 w-full", children: [_jsx("input", { type: "text", name: "prenom", value: editedPatient.prenom, onChange: handleChange, className: "input-field flex-1", placeholder: "Pr\u00E9nom" }), _jsx("input", { type: "text", name: "nom", value: editedPatient.nom, onChange: handleChange, className: "input-field flex-1", placeholder: "Nom" })] })) : (_jsxs("h3", { className: "text-lg font-semibold text-medical-900", children: [patient.prenom, " ", patient.nom] })), _jsxs("span", { className: "text-sm text-medical-500", children: ["ID: ", patient._id.slice(-6)] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Mail, { className: "h-4 w-4" }), editingPatientId === patient._id ? (_jsx("input", { type: "email", name: "email", value: editedPatient.email, onChange: handleChange, className: "input-field flex-1", placeholder: "Email" })) : (_jsx("span", { children: patient.email }))] }), _jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Phone, { className: "h-4 w-4" }), editingPatientId === patient._id ? (_jsx("input", { type: "tel", name: "tel", value: editedPatient.tel, onChange: handleChange, className: "input-field flex-1", placeholder: "T\u00E9l\u00E9phone" })) : (_jsx("span", { children: patient.tel || 'Non renseigné' }))] }), _jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), editingPatientId === patient._id ? (_jsx("input", { type: "date", name: "date_naissance", value: editedPatient.date_naissance, onChange: handleChange, className: "input-field flex-1" })) : (_jsx("span", { children: patient.date_naissance ? `Né(e) le ${patient.date_naissance}` : 'Date de naissance non renseignée' }))] })] }), _jsx("div", { className: "mt-2", children: editingPatientId === patient._id ? (_jsx("input", { type: "text", name: "doctor_id", value: editedPatient.doctor_id, onChange: handleChange, className: "input-field w-full", placeholder: "ID du m\u00E9decin assign\u00E9" })) : (patient.doctor_id && (_jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: ["M\u00E9decin assign\u00E9: ", patient.doctor_id] }))) }), _jsx("div", { className: "mt-3 p-3 bg-yellow-50 rounded-lg", children: editingPatientId === patient._id ? (_jsxs(_Fragment, { children: [_jsx("input", { type: "text", name: "maladie", value: editedPatient.maladie, onChange: handleChange, className: "input-field w-full mb-2", placeholder: "Condition m\u00E9dicale" }), _jsx("textarea", { name: "description_maladie", value: editedPatient.description_maladie, onChange: handleChange, className: "input-field w-full", placeholder: "Description de la condition", rows: 3 })] })) : (_jsx(_Fragment, { children: patient.maladie && (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-sm font-medium text-yellow-800", children: ["Condition: ", patient.maladie] }), patient.description_maladie && (_jsx("p", { className: "text-sm text-yellow-700 mt-1", children: patient.description_maladie }))] })) })) })] }), _jsx("div", { className: "flex flex-col space-y-2", children: editingPatientId === patient._id ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleSave(patient._id), className: "p-2 text-green-600 hover:bg-green-50 rounded-full", title: "Enregistrer", children: _jsx(Save, { className: "h-5 w-5" }) }), _jsx("button", { onClick: handleCancelEdit, className: "p-2 text-red-600 hover:bg-red-50 rounded-full", title: "Annuler", children: _jsx(X, { className: "h-5 w-5" }) })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleEdit(patient), className: "p-2 text-blue-600 hover:bg-blue-50 rounded-full", title: "Modifier", children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleDelete(patient._id), className: "p-2 text-red-600 hover:bg-red-50 rounded-full", title: "Supprimer", children: _jsx(Trash2, { className: "h-5 w-5" }) })] })) })] }) }, patient._id))) })) })] }));
}
