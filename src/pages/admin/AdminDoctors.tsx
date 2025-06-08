import React, { useState, useEffect } from 'react'
import { adminAPI, doctorAPI } from '../../services/api'
import { UserCheck, User, Mail, Phone, Stethoscope, Search, Edit, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null)
  const [editedDoctor, setEditedDoctor] = useState<any>({})
  const [deletingDoctor, setDeletingDoctor] = useState<any>(null)
  const [deleteReason, setDeleteReason] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllDoctors()
      setDoctors(response.data || [])
    } catch (error: any) {
      toast.error('Erreur lors du chargement des médecins')
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((doctor: any) =>
    `${doctor.prenom} ${doctor.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (doctor: any) => {
    setEditingDoctorId(doctor._id)
    setEditedDoctor({
      prenom: doctor.prenom,
      nom: doctor.nom,
      email: doctor.email,
      tel: doctor.tel || '',
      specialite: doctor.specialite
    })
  }

  const handleCancelEdit = () => {
    setEditingDoctorId(null)
    setEditedDoctor({})
  }

  const handleSave = async (doctorId: string) => {
    try {
      // Filtrer les champs vides pour ne pas envoyer de valeurs null
      const dataToSend = Object.fromEntries(
        Object.entries(editedDoctor).filter(([_, v]) => v !== '')
      )
      
      await doctorAPI.update(doctorId, dataToSend)
      toast.success('Médecin mis à jour avec succès')
      setEditingDoctorId(null)
      loadDoctors() // Recharger la liste des médecins
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du médecin')
      console.error('Update error:', error)
    }
  }

  const handleDelete = (doctor: any) => {
    setDeletingDoctor(doctor)
    setDeleteReason('')
  }

  const confirmDelete = async () => {
    if (!deletingDoctor) return

    try {
      await doctorAPI.delete(deletingDoctor._id)
      toast.success('Médecin supprimé avec succès')
      setDeletingDoctor(null)
      setDeleteReason('')
      loadDoctors() // Recharger la liste des médecins
    } catch (error) {
      toast.error('Erreur lors de la suppression du médecin')
      console.error('Delete error:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedDoctor((prev:Record<string, any>) => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-medical-900">
            Gestion des médecins
          </h1>
          <p className="text-medical-600">
            Vue d'ensemble de tous les médecins approuvés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-medical-600">Total médecins</p>
            <p className="text-xl font-bold text-medical-900">
              {doctors.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-medical-400" />
          <input
            type="text"
            placeholder="Rechercher un médecin par nom, email ou spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
      </div>

      {/* Doctors List */}
      <div className="card">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-medical-300 mx-auto mb-4" />
            <p className="text-medical-600">
              {searchTerm ? 'Aucun médecin trouvé' : 'Aucun médecin enregistré'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor: any) => (
              <div
                key={doctor._id}
                className="border border-medical-200 rounded-lg p-6 hover:bg-medical-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      {editingDoctorId === doctor._id ? (
                        <div className="flex space-x-2 w-full">
                          <input
                            type="text"
                            name="prenom"
                            value={editedDoctor.prenom}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Prénom"
                          />
                          <input
                            type="text"
                            name="nom"
                            value={editedDoctor.nom}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Nom"
                          />
                        </div>
                      ) : (
                        <h3 className="text-lg font-semibold text-medical-900">
                          Dr. {doctor.prenom} {doctor.nom}
                        </h3>
                      )}
                      <span className="text-sm text-medical-500">
                        ID: {doctor._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      {editingDoctorId === doctor._id ? (
                        <select
                          name="specialite"
                          value={editedDoctor.specialite}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Sélectionnez une spécialité</option>
                          {specialites.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {doctor.specialite}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Mail className="h-4 w-4" />
                        {editingDoctorId === doctor._id ? (
                          <input
                            type="email"
                            name="email"
                            value={editedDoctor.email}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Email"
                          />
                        ) : (
                          <span>{doctor.email}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Phone className="h-4 w-4" />
                        {editingDoctorId === doctor._id ? (
                          <input
                            type="tel"
                            name="tel"
                            value={editedDoctor.tel}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Téléphone"
                          />
                        ) : (
                          <span>{doctor.tel || 'Non renseigné'}</span>
                        )}
                      </div>
                      
                      {doctor.created_at && (
                        <div className="flex items-center space-x-2 text-medical-600">
                          <User className="h-4 w-4" />
                          <span>Inscrit le {new Date(doctor.created_at.$date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {doctor.patient_count !== undefined && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {doctor.patient_count} patient(s) assigné(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {editingDoctorId === doctor._id ? (
                      <>
                        <button
                          onClick={() => handleSave(doctor._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Enregistrer"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Annuler"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-medical-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer le Dr. {deletingDoctor.prenom} {deletingDoctor.nom} ?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-medical-700 mb-2">
                Raison de la suppression (optionnelle)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="input-field"
                placeholder="Entrez la raison de la suppression..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingDoctor(null)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}