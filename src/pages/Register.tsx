import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { doctorAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Activity, User, Mail, Lock, Phone, Stethoscope } from 'lucide-react'

interface RegisterForm {
  nom: string
  prenom: string
  email: string
  mot_de_passe: string
  confirmPassword: string
  specialite: string
  tel: string
}

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
]

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('mot_de_passe')

  const onSubmit = async (data: RegisterForm) => {
    if (data.mot_de_passe !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...submitData } = data
      await doctorAPI.submitRequest({
        ...submitData,
        created_at: new Date().toISOString()
      })
      
      toast.success('Demande soumise avec succès! Un administrateur va examiner votre demande.')
      navigate('/login')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la soumission'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-medical-900">
            Demande d'accès médecin
          </h2>
          <p className="mt-2 text-sm text-medical-600">
            Soumettez votre demande pour rejoindre notre équipe
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Prénom
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
                  Nom
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

            <div>
              <label className="block text-sm font-medium text-medical-700 mb-2">
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
              <label className="block text-sm font-medium text-medical-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-medical-400" />
                </div>
                <input
                  {...register('tel', { required: 'Le téléphone est requis' })}
                  type="tel"
                  className="input-field pl-10"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              {errors.tel && (
                <p className="error-message">{errors.tel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-700 mb-2">
                Spécialité
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-medical-400" />
                </div>
                <select
                  {...register('specialite', { required: 'La spécialité est requise' })}
                  className="input-field pl-10"
                >
                  <option value="">Sélectionnez une spécialité</option>
                  {specialites.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              {errors.specialite && (
                <p className="error-message">{errors.specialite.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-700 mb-2">
                Mot de passe
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
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.mot_de_passe && (
                <p className="error-message">{errors.mot_de_passe.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-medical-700 mb-2">
                Confirmer le mot de passe
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
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword.message}</p>
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
                'Soumettre la demande'
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