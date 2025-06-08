import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { doctorAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Activity, User, Mail, Lock, Phone, Stethoscope, Calendar } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


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

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState('')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
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
        tel: phone,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Demande d'accès médecin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Soumettez votre demande pour rejoindre notre équipe
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Prénom"
                  />
                </div>
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  {...register('nom', { required: 'Le nom est requis' })}
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                )}
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

        
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Téléphone
  </label>
  <div className="relative">
    {/* Phone icon (absolute positioned) */}
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      <Phone className="h-5 w-5 text-gray-400" />
    </div>
    
    {/* PhoneInput with enhanced styling */}
    <PhoneInput
      international
      defaultCountry="FR"
      value={phone}
      onChange={(value) => {
        setPhone(value || '')
        setValue('tel', value || '')
      }}
      className={`
        block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        sm:text-sm bg-white text-gray-900
        transition duration-150 ease-in-out
      `}
      style={{
        '--PhoneInputCountryFlag-height': '1.2em',
        '--PhoneInputCountryFlag-borderColor': 'rgba(0,0,0,0.1)',
        '--PhoneInput-color--focus': '#3b82f6',
      } as React.CSSProperties}
    />
    
    {/* Hidden input for react-hook-form */}
    <input
      {...register('tel', { 
        required: 'Le téléphone est requis',
        validate: (value) => phone?.length > 5 || 'Numéro de téléphone invalide'
      })}
      type="hidden"
    />
  </div>
  {errors.tel && (
    <p className="mt-1 text-sm text-red-600">{errors.tel.message}</p>
  )}
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register('specialite', { required: 'La spécialité est requise' })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <p className="mt-1 text-sm text-red-600">{errors.specialite.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.mot_de_passe && (
                <p className="mt-1 text-sm text-red-600">{errors.mot_de_passe.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'La confirmation est requise',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas'
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Soumettre la demande'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
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