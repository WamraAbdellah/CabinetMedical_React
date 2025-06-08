import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { Users, User, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
export default function DoctorPatients() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        loadPatients();
    }, [user]);
    const loadPatients = async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const response = await doctorAPI.getPatients(user._id);
            setPatients(response.data.patients || []);
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
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "loading-spinner" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Mes patients" }), _jsx("p", { className: "text-medical-600", children: "G\u00E9rez vos patients assign\u00E9s" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-medical-600", children: "Total patients" }), _jsx("p", { className: "text-xl font-bold text-medical-900", children: patients.length })] })] })] }), _jsx("div", { className: "card", children: _jsx("div", { className: "flex items-center space-x-4", children: _jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Rechercher un patient...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "input-field" }) }) }) }), _jsx("div", { className: "card", children: filteredPatients.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-12 w-12 text-medical-300 mx-auto mb-4" }), _jsx("p", { className: "text-medical-600", children: searchTerm ? 'Aucun patient trouvé' : 'Aucun patient assigné' })] })) : (_jsx("div", { className: "space-y-4", children: filteredPatients.map((patient) => (_jsx("div", { className: "border border-medical-200 rounded-lg p-6 hover:bg-medical-50 transition-colors", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(User, { className: "h-6 w-6 text-primary-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-lg font-semibold text-medical-900", children: [patient.prenom, " ", patient.nom] }), _jsxs("span", { className: "text-sm text-medical-500", children: ["ID: ", patient._id.slice(-6)] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: patient.email })] }), patient.tel && (_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Phone, { className: "h-4 w-4" }), _jsx("span", { children: patient.tel })] })), patient.date_naissance && (_jsxs("div", { className: "flex items-center space-x-2 text-medical-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["N\u00E9(e) le ", patient.date_naissance] })] }))] }), patient.maladie && (_jsxs("div", { className: "mt-3 p-3 bg-yellow-50 rounded-lg", children: [_jsxs("p", { className: "text-sm font-medium text-yellow-800", children: ["Condition: ", patient.maladie] }), patient.description_maladie && (_jsx("p", { className: "text-sm text-yellow-700 mt-1", children: patient.description_maladie }))] }))] })] }) }, patient._id))) })) })] }));
}
