import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { patientAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Activity, User, Mail, Lock, Phone, Calendar, FileText, Eye, EyeOff } from 'lucide-react'

interface PatientSignupForm {
  nom: string
  prenom: string
  email: string
  mot_de_passe: string
  confirmPassword: string
  tel?: string
  date_naissance: string
  maladie?: string
  description_maladie?: string
}

export default function PatientSignup() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PatientSignupForm>()

  const password = watch('mot_de_passe')

  const onSubmit = async (data: PatientSignupForm) => {
    if (data.mot_de_passe !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...submitData } = data
      await patientAPI.create(submitData)
      
      toast.success('Compte créé avec succès! Vous pouvez maintenant vous connecter.')
      navigate('/login')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la création du compte'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-medical-900">
            Inscription Patient
          </h2>
          <p className="mt-2 text-sm text-medical-600">
            Créez votre compte pour accéder à nos services médicaux
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Informations personnelles */}
            <div>
              <h3 className="text-lg font-medium text-medical-900 mb-4">
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-medical-400" />
                    </div>
                    <input
                      {...register('prenom', { required: 'Le prénom est requis' })}
                      type="text"
                      className="input-field pl-10"
                      placeholder="Prénom"
                    />
                  </div>
                  {errors.prenom && (
                    <p className="error-message">{errors.prenom.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Nom *
                  </label>
                  <input
                    {...register('nom', { required: 'Le nom est requis' })}
                    type="text"
                    className="input-field"
                    placeholder="Nom"
                  />
                  {errors.nom && (
                    <p className="error-message">{errors.nom.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-medium text-medical-900 mb-4">
                Informations de contact
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Adresse email *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-medical-400" />
                      </div>
                      <input
                        {...register('tel')}
                        type="tel"
                        className="input-field pl-10"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Date de naissance *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-medical-400" />
                      </div>
                      <input
                        {...register('date_naissance', { required: 'La date de naissance est requise' })}
                        type="date"
                        className="input-field pl-10"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.date_naissance && (
                      <p className="error-message">{errors.date_naissance.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div>
              <h3 className="text-lg font-medium text-medical-900 mb-4">
                Informations médicales (optionnel)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Maladie/Condition
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-medical-400" />
                    </div>
                    <input
                      {...register('maladie')}
                      type="text"
                      className="input-field pl-10"
                      placeholder="Ex: Diabète, Hypertension, Asthme..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Description de la condition
                  </label>
                  <textarea
                    {...register('description_maladie')}
                    className="input-field"
                    rows={3}
                    placeholder="Décrivez votre condition médicale, symptômes, traitements en cours..."
                  />
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <h3 className="text-lg font-medium text-medical-900 mb-4">
                Sécurité
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-medical-400" />
                    </div>
                    <input
                      {...register('mot_de_passe', {
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
                  {errors.mot_de_passe && (
                    <p className="error-message">{errors.mot_de_passe.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-medical-400" />
                    </div>
                    <input
                      {...register('confirmPassword', {
                        required: 'La confirmation est requise',
                        validate: (value) =>
                          value === password || 'Les mots de passe ne correspondent pas'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-medical-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-medical-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5"></div>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-medical-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}