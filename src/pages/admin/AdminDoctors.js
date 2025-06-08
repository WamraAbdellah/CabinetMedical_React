import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { adminAPI, doctorAPI } from '../../services/api';
import { UserCheck, User, Mail, Phone, Stethoscope, Search, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
const specialites = [
    'Généraliste',
    'Cardiologue',
    'Pneumologue',
    'Dermatologue',
    'Pédiatre',
    'Neurologue',
    'Gastro-entérologue',
    'Endocrinologue',
    'Rhumatologue',
    'Ophtalmologue',
    'ORL',
    'Gynécologue',
    'Urologue',
    'Néphrologue',
    'Oncologue',
    'Hématologue',
    'Chirurgien général',
    'Chirurgien orthopédiste',
    'Chirurgien cardiaque',
    'Chirurgien plastique',
    'Radiologue',
    'Anesthésiste',
    'Médecin du sport',
    'Médecin du travail',
    'Psychiatre',
    'Psychologue',
    'Médecin urgentiste',
    'Allergologue',
    'Infectiologue',
    'Médecin interne',
    'Gériatre',
    'Médecin rééducateur'
];
export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editedDoctor, setEditedDoctor] = useState({});
    const [deletingDoctor, setDeletingDoctor] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    useEffect(() => {
        loadDoctors();
    }, []);
    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllDoctors();
            setDoctors(response.data || []);
        }
        catch (error) {
            toast.error('Erreur lors du chargement des médecins');
        }
        finally {
            setLoading(false);
        }
    };
    const filteredDoctors = doctors.filter((doctor) => `${doctor.prenom} ${doctor.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleEdit = (doctor) => {
        setEditingDoctorId(doctor._id);
        setEditedDoctor({
            prenom: doctor.prenom,
            nom: doctor.nom,
            email: doctor.email,
            tel: doctor.tel || '',
            specialite: doctor.specialite
        });
    };
    const handleCancelEdit = () => {
        setEditingDoctorId(null);
        setEditedDoctor({});
    };
    const handleSave = async (doctorId) => {
        try {
            // Filtrer les champs vides pour ne pas envoyer de valeurs null
            const dataToSend = Object.fromEntries(Object.entries(editedDoctor).filter(([_, v]) => v !== ''));
            await doctorAPI.update(doctorId, dataToSend);
            toast.success('Médecin mis à jour avec succès');
            setEditingDoctorId(null);
            loadDoctors(); // Recharger la liste des médecins
        }
        catch (error) {
            toast.error('Erreur lors de la mise à jour du médecin');
            console.error('Update error:', error);
        }
    };
    const handleDelete = (doctor) => {
        setDeletingDoctor(doctor);
        setDeleteReason('');
    };
    const confirmDelete = async () => {
        if (!deletingDoctor)
            return;
        try {
            await doctorAPI.delete(deletingDoctor._id);
            toast.success('Médecin supprimé avec succès');
            setDeletingDoctor(null);
            setDeleteReason('');
            loadDoctors(); // Recharger la liste des médecins
        }
        catch (error) {
            toast.error('Erreur lors de la suppression du médecin');
            console.error('Delete error:', error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedDoctor((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Gestion des m\u00E9decins" }), _jsx("p", { className: "text-medical-600", children: "Vue d'ensemble de tous les m\u00E9decins approuv\u00E9s" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(UserCheck, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Total m\u00E9decins" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: doctors.length })] })] })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Search, { className: "h-5 w-5 text-medical-400" }), _jsx("input", { type: "text", placeholder: "Rechercher un m\u00E9decin par nom, email ou sp\u00E9cialit\u00E9...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "input-field flex-1" })] }) }), _jsx("div", { className: "card", children: filteredDoctors.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(UserCheck, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: searchTerm ? 'Aucun médecin trouvé' : 'Aucun médecin enregistré' })] })) : (_jsx("div", { className: "space-y-4", children: filteredDoctors.map((doctor) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-6 hover:bg-medical-50 transition-colors", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Stethoscope, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [editingDoctorId === doctor._id ? (_jsxs("div", { className: "flex space-x-2 w-full", children: [_jsx("input", { type: "text", name: "prenom", value: editedDoctor.prenom, onChange: handleChange, className: "input-field flex-1", placeholder: "Pr\u00E9nom" }), _jsx("input", { type: "text", name: "nom", value: editedDoctor.nom, onChange: handleChange, className: "input-field flex-1", placeholder: "Nom" })] })) : (_jsxs("h3", { className: "text-lg font-semibold text-medical-900", children: ["Dr. ", doctor.prenom, " ", doctor.nom] })), _jsxs("span", { className: "text-sm text-medical-500", children: ["ID: ", doctor._id.slice(-6)] })] }), _jsx("div", { className: "mb-2", children: editingDoctorId === doctor._id ? (_jsxs("select", { name: "specialite", value: editedDoctor.specialite, onChange: handleChange, className: "input-field", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez une sp\u00E9cialit\u00E9" }), specialites.map((spec) => (_jsx("option", { value: spec, children: spec }, spec)))] })) : (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: doctor.specialite })) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Mail, { className: "h-4 w-4" }), editingDoctorId === doctor._id ? (_jsx("input", { type: "email", name: "email", value: editedDoctor.email, onChange: handleChange, className: "input-field flex-1", placeholder: "Email" })) : (_jsx("span", { children: doctor.email }))] }), _jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Phone, { className: "h-4 w-4" }), editingDoctorId === doctor._id ? (_jsx("input", { type: "tel", name: "tel", value: editedDoctor.tel, onChange: handleChange, className: "input-field flex-1", placeholder: "T\u00E9l\u00E9phone" })) : (_jsx("span", { children: doctor.tel || 'Non renseigné' }))] }), doctor.created_at && (_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(User, { className: "h-4 w-4" }), _jsxs("span", { children: ["Inscrit le ", new Date(doctor.created_at.$date).toLocaleDateString()] })] }))] }), doctor.patient_count !== undefined && (_jsx("div", { className: "mt-2", children: _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [doctor.patient_count, " patient(s) assign\u00E9(s)"] }) }))] }), _jsx("div", { className: "flex flex-col space-y-2", children: editingDoctorId === doctor._id ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleSave(doctor._id), className: "p-2 text-green-600 hover:bg-green-50 rounded-full", title: "Enregistrer", children: _jsx(Save, { className: "h-5 w-5" }) }), _jsx("button", { onClick: handleCancelEdit, className: "p-2 text-red-600 hover:bg-red-50 rounded-full", title: "Annuler", children: _jsx(X, { className: "h-5 w-5" }) })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleEdit(doctor), className: "p-2 text-blue-600 hover:bg-blue-50 rounded-full", title: "Modifier", children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleDelete(doctor), className: "p-2 text-red-600 hover:bg-red-50 rounded-full", title: "Supprimer", children: _jsx(Trash2, { className: "h-5 w-5" }) })] })) })] }) }, doctor._id))) })) }), deletingDoctor && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-4", children: "Confirmer la suppression" }), _jsxs("p", { className: "mb-4", children: ["\u00CAtes-vous s\u00FBr de vouloir supprimer le Dr. ", deletingDoctor.prenom, " ", deletingDoctor.nom, " ?"] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Raison de la suppression (optionnelle)" }), _jsx("textarea", { value: deleteReason, onChange: (e) => setDeleteReason(e.target.value), className: "input-field", placeholder: "Entrez la raison de la suppression..." })] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setDeletingDoctor(null), className: "btn-secondary", children: "Annuler" }), _jsxs("button", { onClick: confirmDelete, className: "btn-danger flex items-center space-x-2", children: [_jsx(Trash2, { className: "h-4 w-4" }), _jsx("span", { children: "Confirmer" })] })] })] }) }))] }));
}
