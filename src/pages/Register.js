import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doctorAPI, patientAPI, adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Activity, User, Mail, Lock, Phone, Stethoscope } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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
export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailChecking, setIsEmailChecking] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(true);
    const [phone, setPhone] = useState('');
    const { register, handleSubmit, watch, formState: { errors }, setValue, trigger, } = useForm();
    const email = watch('email');
    const password = watch('mot_de_passe');
    // Vérification de la disponibilité de l'email
    useEffect(() => {
        const checkEmailAvailability = async () => {
            if (email && !errors.email) {
                setIsEmailChecking(true);
                try {
                    // Vérifier dans les trois collections
                    const [doctorsRes, patientsRes, pendingRes] = await Promise.all([
                        doctorAPI.list(),
                        patientAPI.list(),
                        adminAPI.getPendingDoctors()
                    ]);
                    console.log(pendingRes);
                    const allEmails = [
                        ...doctorsRes.data.doctors.map((d) => d.email),
                        ...patientsRes.data.patients.map((p) => p.email),
                        ...pendingRes.data.map((p) => p.email)
                    ];
                    setEmailAvailable(!allEmails.includes(email));
                }
                catch (error) {
                    console.error("Erreur lors de la vérification de l'email", error);
                    setEmailAvailable(true);
                }
                finally {
                    setIsEmailChecking(false);
                }
            }
        };
        const timer = setTimeout(() => {
            if (email)
                checkEmailAvailability();
        }, 500);
        return () => clearTimeout(timer);
    }, [email, errors.email]);
    const onSubmit = async (data) => {
        if (data.mot_de_passe !== data.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        if (!emailAvailable) {
            toast.error('Cet email est déjà utilisé');
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...submitData } = data;
            await doctorAPI.submitRequest({
                ...submitData,
                tel: phone,
                created_at: new Date().toISOString()
            });
            toast.success('Demande soumise avec succès! Un administrateur va examiner votre demande.');
            navigate('/login');
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur lors de la soumission';
            toast.error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx(Activity, { className: "h-8 w-8 text-white" }) }), _jsx("h2", { className: "mt-6 text-3xl font-bold text-gray-900", children: "Demande d'acc\u00E8s m\u00E9decin" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Soumettez votre demande pour rejoindre notre \u00E9quipe" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [_jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { ...register('prenom', { required: 'Le prénom est requis' }), type: "text", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "Pr\u00E9nom" })] }), errors.prenom && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.prenom.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom" }), _jsx("input", { ...register('nom', { required: 'Le nom est requis' }), type: "text", className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "Nom" }), errors.nom && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.nom.message }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Adresse email" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { ...register('email', {
                                                        required: 'L\'email est requis',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Adresse email invalide'
                                                        }
                                                    }), type: "email", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "votre@email.com" })] }), email && !errors.email && (_jsx("div", { className: "mt-1 text-sm", children: isEmailChecking ? (_jsx("span", { className: "text-gray-500", children: "V\u00E9rification de l'email..." })) : !emailAvailable ? (_jsx("span", { className: "text-red-600", children: "Cet email est d\u00E9j\u00E0 utilis\u00E9" })) : (_jsx("span", { className: "text-green-600", children: "Email disponible" })) })), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10", children: _jsx(Phone, { className: "h-5 w-5 text-gray-400" }) }), _jsx(PhoneInput, { international: true, defaultCountry: "FR", value: phone, onChange: (value) => {
                                                        setPhone(value || '');
                                                        setValue('tel', value || '');
                                                    }, className: `
                    block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    sm:text-sm bg-white text-gray-900
                    transition duration-150 ease-in-out
                  `, style: {
                                                        '--PhoneInputCountryFlag-height': '1.2em',
                                                        '--PhoneInputCountryFlag-borderColor': 'rgba(0,0,0,0.1)',
                                                        '--PhoneInput-color--focus': '#3b82f6',
                                                    } }), _jsx("input", { ...register('tel', {
                                                        required: 'Le téléphone est requis',
                                                        validate: (value) => phone?.length > 5 || 'Numéro de téléphone invalide'
                                                    }), type: "hidden" })] }), errors.tel && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.tel.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sp\u00E9cialit\u00E9" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Stethoscope, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("select", { ...register('specialite', { required: 'La spécialité est requise' }), className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez une sp\u00E9cialit\u00E9" }), specialites.map((spec) => (_jsx("option", { value: spec, children: spec }, spec)))] })] }), errors.specialite && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.specialite.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { ...register('mot_de_passe', {
                                                        required: 'Le mot de passe est requis',
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                                                        }
                                                    }), type: "password", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), errors.mot_de_passe && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.mot_de_passe.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirmer le mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { ...register('confirmPassword', {
                                                        required: 'La confirmation est requise',
                                                        validate: (value) => value === password || 'Les mots de passe ne correspondent pas'
                                                    }), type: "password", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), errors.confirmPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading || !emailAvailable, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? (_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : ('Soumettre la demande') })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Vous avez d\u00E9j\u00E0 un compte ?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Se connecter" })] }) })] })] }) }));
}
