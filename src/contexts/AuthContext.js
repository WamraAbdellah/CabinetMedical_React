import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
const AuthContext = createContext(undefined);
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            }
            catch (error) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authAPI.login(email, password);
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            toast.success(`Bienvenue, ${userData.prenom} ${userData.nom}!`);
            return true;
        }
        catch (error) {
            const message = error.response?.data?.error || 'Erreur de connexion';
            toast.error(message);
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        toast.success('Déconnexion réussie');
    };
    const updateUser = (userData) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };
    const value = {
        user,
        login,
        logout,
        loading,
        updateUser
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
}
