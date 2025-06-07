import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { patientAPI } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Calendar, FileText, Save } from 'lucide-react'

interface ProfileForm {
  nom: string
  prenom: string
  email: string
  tel?: string
  date_naissance: string
  maladie?: string
  description_maladie?: string
}

export default function PatientProfile() {
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
      date_naissance: user?.date_naissance || '',
      maladie: user?.maladie || '',
      description_maladie: user?.description_maladie || ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await patientAPI.update(user._id, data)
      updateUser(response.data.patient)
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
          <p className="text-medical-600">Gérez vos informations personnelles</p>
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
              <User className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-medical-900">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-medical-600 capitalize">{user.role}</p>
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
              Informations personnelles
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Date de naissance
                  </label>
                  <input
                    {...register('date_naissance')}
                    type="date"
                    className="input-field"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Maladie/Condition
                </label>
                <input
                  {...register('maladie')}
                  type="text"
                  className="input-field"
                  disabled={!isEditing}
                  placeholder="Ex: Diabète, Hypertension..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Description de la maladie
                </label>
                <textarea
                  {...register('description_maladie')}
                  className="input-field"
                  rows={4}
                  disabled={!isEditing}
                  placeholder="Décrivez votre condition médicale, symptômes, traitements en cours..."
                />
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