import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { patientAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Activity, User, Mail, Lock, Phone, Calendar, FileText, Eye, EyeOff } from 'lucide-react';
export default function PatientSignup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, } = useForm();
    const validateAge = (dateString) => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 15 || 'Vous devez avoir au moins 15 ans pour vous inscrire';
    };
    const password = watch('mot_de_passe');
    const onSubmit = async (data) => {
        if (data.mot_de_passe !== data.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...submitData } = data;
            await patientAPI.create(submitData);
            toast.success('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
            navigate('/login');
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de la création du compte';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-100 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx(Activity, { className: "h-8 w-8 text-white" }) }), _jsx("h2", { className: "mt-6 text-3xl font-bold text-medical-900", children: "Inscription Patient" }), _jsx("p", { className: "mt-2 text-sm text-medical-600", children: "Cr\u00E9ez votre compte pour acc\u00E9der \u00E0 nos services m\u00E9dicaux" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [_jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-medical-900 mb-4", children: "Informations personnelles" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Pr\u00E9nom *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('prenom', { required: 'Le prénom est requis' }), type: "text", className: "input-field pl-10", placeholder: "Pr\u00E9nom" })] }), errors.prenom && (_jsx("p", { className: "error-message", children: errors.prenom.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Nom *" }), _jsx("input", { ...register('nom', { required: 'Le nom est requis' }), type: "text", className: "input-field", placeholder: "Nom" }), errors.nom && (_jsx("p", { className: "error-message", children: errors.nom.message }))] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-medical-900 mb-4", children: "Informations de contact" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Adresse email *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('email', {
                                                                        required: 'L\'email est requis',
                                                                        pattern: {
                                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                            message: 'Adresse email invalide'
                                                                        }
                                                                    }), type: "email", className: "input-field pl-10", placeholder: "votre@email.com" })] }), errors.email && (_jsx("p", { className: "error-message", children: errors.email.message }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Phone, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('tel', { required: 'Le num de telephone est requis' }), type: "tel", className: "input-field pl-10", placeholder: "+33 1 23 45 67 89" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Date de naissance *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Calendar, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('date_naissance', { required: 'La date de naissance est requise', validate: validateAge }), type: "date", className: "input-field pl-10", max: new Date().toISOString().split('T')[0] })] }), errors.date_naissance && (_jsx("p", { className: "error-message", children: errors.date_naissance.message }))] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-medical-900 mb-4", children: "Informations m\u00E9dicales" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Maladie/Condition" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FileText, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('maladie'), type: "text", className: "input-field pl-10", placeholder: "Ex: Diab\u00E8te, Hypertension, Asthme...", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Description de la condition" }), _jsx("textarea", { ...register('description_maladie'), className: "input-field", rows: 3, required: true, placeholder: "D\u00E9crivez votre condition m\u00E9dicale, sympt\u00F4mes, traitements en cours..." })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-medical-900 mb-4", children: "S\u00E9curit\u00E9" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Mot de passe *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('mot_de_passe', {
                                                                        required: 'Le mot de passe est requis',
                                                                        minLength: {
                                                                            value: 6,
                                                                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                                                                        }
                                                                    }), type: showPassword ? 'text' : 'password', className: "input-field pl-10 pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-medical-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-medical-400" })) })] }), errors.mot_de_passe && (_jsx("p", { className: "error-message", children: errors.mot_de_passe.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-medical-700 mb-2", children: "Confirmer le mot de passe *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('confirmPassword', {
                                                                        required: 'La confirmation est requise',
                                                                        validate: (value) => value === password || 'Les mots de passe ne correspondent pas'
                                                                    }), type: showConfirmPassword ? 'text' : 'password', className: "input-field pl-10 pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-medical-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-medical-400" })) })] }), errors.confirmPassword && (_jsx("p", { className: "error-message", children: errors.confirmPassword.message }))] })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full btn-primary flex items-center justify-center", children: isLoading ? (_jsx("div", { className: "loading-spinner h-5 w-5" })) : ('Créer mon compte') })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-medical-600", children: ["Vous avez d\u00E9j\u00E0 un compte ?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-primary-600 hover:text-primary-500 transition-colors", children: "Se connecter" })] }) })] })] }) }));
}
