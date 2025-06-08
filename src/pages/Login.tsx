import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    await login(data.email, data.password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-medical-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-medical-600">
            Accédez à votre espace personnel
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-medical-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-medical-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  type="email"
                  className="input-field pl-10"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-medical-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-medical-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-medical-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-medical-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-medical-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-medical-500">Pas encore de compte ?</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/register/patient"
                className="w-full btn-secondary text-center"
              >
                S'inscrire comme patient
              </Link>
              <Link
                to="/register/doctor"
                className="w-full btn-secondary text-center"
              >
                Demander un accès médecin
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-medical-500">
            © 2025 Cabinet Médical. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}