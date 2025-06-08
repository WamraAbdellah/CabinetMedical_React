import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
export default function Login() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = async (data) => {
        setIsLoading(true);
        await login(data.email, data.password);
        setIsLoading(false);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-100 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx(Activity, { className: "h-8 w-8 text-white" }) }), _jsx("h2", { className: "mt-6 text-3xl font-bold text-medical-900", children: "Connexion" }), _jsx("p", { className: "mt-2 text-sm text-medical-600", children: "Acc\u00E9dez \u00E0 votre espace personnel" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [_jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-medical-700 mb-2", children: "Adresse email" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('email', {
                                                        required: 'L\'email est requis',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Adresse email invalide'
                                                        }
                                                    }), type: "email", className: "input-field pl-10", placeholder: "votre@email.com" })] }), errors.email && (_jsx("p", { className: "error-message", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-medical-700 mb-2", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-medical-400" }) }), _jsx("input", { ...register('password', {
                                                        required: 'Le mot de passe est requis',
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                                                        }
                                                    }), type: showPassword ? 'text' : 'password', className: "input-field pl-10 pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-medical-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-medical-400" })) })] }), errors.password && (_jsx("p", { className: "error-message", children: errors.password.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full btn-primary flex items-center justify-center", children: isLoading ? (_jsx("div", { className: "loading-spinner h-5 w-5" })) : ('Se connecter') })] }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-medical-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-medical-500", children: "Pas encore de compte ?" }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsx(Link, { to: "/register/patient", className: "w-full btn-secondary text-center", children: "S'inscrire comme patient" }), _jsx(Link, { to: "/register/doctor", className: "w-full btn-secondary text-center", children: "Demander un acc\u00E8s m\u00E9decin" })] })] })] }), _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-xs text-medical-500", children: "\u00A9 2025 Cabinet M\u00E9dical. Tous droits r\u00E9serv\u00E9s." }) })] }) }));
}
