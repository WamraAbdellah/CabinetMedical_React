import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Save } from 'lucide-react';
export default function PatientProfile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: user?.nom || '',
            prenom: user?.prenom || '',
            email: user?.email || '',
            tel: user?.tel || '',
            date_naissance: user?.date_naissance || '',
            maladie: user?.maladie || '',
            description_maladie: user?.description_maladie || ''
        }
    });
    const onSubmit = async (data) => {
        if (!user)
            return;
        setIsLoading(true);
        try {
            const response = await patientAPI.update(user._id, data);
            updateUser(response.data.patient);
            toast.success('Profil mis à jour avec succès!');
            setIsEditing(false);
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de la mise à jour';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };
    if (!user)
        return null;
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-medical-900", children: "Mon profil" }), _jsx("p", { className: "text-medical-600", children: "G\u00E9rez vos informations personnelles" })] }), !isEditing && (_jsx("button", { onClick: () => setIsEditing(true), className: "btn-primary", children: "Modifier" }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card text-center", children: [_jsx("div", { className: "w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(User, { className: "h-12 w-12 text-primary-600" }) }), _jsxs("h3", { className: "text-xl font-semibold text-medical-900", children: [user.prenom, " ", user.nom] }), _jsx("p", { className: "text-medical-600 capitalize", children: user.role }), _jsxs("div", { className: "mt-4 space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 text-medical-600", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: user.email })] }), user.tel && (_jsxs("div", { className: "flex items-center justify-center space-x-2 text-medical-600", children: [_jsx(Phone, { className: "h-4 w-4" }), _jsx("span", { children: user.tel })] }))] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-medical-900 mb-6", children: "Informations personnelles" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Pr\u00E9nom" }), _jsx("input", { ...register('prenom', { required: 'Le prénom est requis' }), type: "text", className: "input-field", disabled: !isEditing }), errors.prenom && (_jsx("p", { className: "error-message", children: errors.prenom.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Nom" }), _jsx("input", { ...register('nom', { required: 'Le nom est requis' }), type: "text", className: "input-field", disabled: !isEditing }), errors.nom && (_jsx("p", { className: "error-message", children: errors.nom.message }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Email" }), _jsx("input", { ...register('email', {
                                                        required: 'L\'email est requis',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Adresse email invalide'
                                                        }
                                                    }), type: "email", className: "input-field", disabled: !isEditing }), errors.email && (_jsx("p", { className: "error-message", children: errors.email.message }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { ...register('tel'), type: "tel", className: "input-field", disabled: !isEditing })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Date de naissance" }), _jsx("input", { ...register('date_naissance'), type: "date", className: "input-field", disabled: !isEditing })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Maladie/Condition" }), _jsx("input", { ...register('maladie'), type: "text", className: "input-field", disabled: !isEditing, placeholder: "Ex: Diab\u00E8te, Hypertension..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Description de la maladie" }), _jsx("textarea", { ...register('description_maladie'), className: "input-field", rows: 4, disabled: !isEditing, placeholder: "D\u00E9crivez votre condition m\u00E9dicale, sympt\u00F4mes, traitements en cours..." })] }), isEditing && (_jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", onClick: handleCancel, className: "btn-secondary flex-1", children: "Annuler" }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-primary flex-1 flex items-center justify-center space-x-2", children: isLoading ? (_jsx("div", { className: "loading-spinner h-4 w-4" })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4" }), _jsx("span", { children: "Sauvegarder" })] })) })] }))] })] }) })] })] }));
}
