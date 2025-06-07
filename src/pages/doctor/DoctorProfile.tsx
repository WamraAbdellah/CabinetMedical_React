import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { doctorAPI } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Stethoscope, Save } from 'lucide-react'

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

interface ProfileForm {
  nom: string
  prenom: string
  email: string
  tel?: string
  specialite: string
}

export default function DoctorProfile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileForm>({
    defaultValues: {
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      tel: user?.tel || '',
      specialite: user?.specialite || ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await doctorAPI.update(user._id, data)
      updateUser(response.data.doctor)
      toast.success('Profil mis à jour avec succès!')
      setIsEditing(false)
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-medical-900">Mon profil</h1>
          <p className="text-medical-600">Gérez vos informations professionnelles</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Modifier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-medical-900">
              Dr. {user.prenom} {user.nom}
            </h3>
            <p className="text-medical-600">{user.specialite}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2 text-medical-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.tel && (
                <div className="flex items-center justify-center space-x-2 text-medical-600">
                  <Phone className="h-4 w-4" />
                  <span>{user.tel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-medical-900 mb-6">
              Informations professionnelles
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Prénom
                  </label>
                  <input
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    type="text"
                    className="input-field"
                    disabled={!isEditing}
                  />
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
                    disabled={!isEditing}
                  />
                  {errors.nom && (
                    <p className="error-message">{errors.nom.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  type="email"
                  className="input-field"
                  disabled={!isEditing}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Téléphone
                </label>
                <input
                  {...register('tel')}
                  type="tel"
                  className="input-field"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Spécialité
                </label>
                <select
                  {...register('specialite', { required: 'La spécialité est requise' })}
                  className="input-field"
                  disabled={!isEditing}
                >
                  <option value="">Sélectionnez une spécialité</option>
                  {specialites.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                {errors.specialite && (
                  <p className="error-message">{errors.specialite.message}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="loading-spinner h-4 w-4"></div>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Sauvegarder</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}