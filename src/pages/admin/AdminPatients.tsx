import React, { useState, useEffect } from 'react'
import { adminAPI, patientAPI } from '../../services/api'
import { Users, User, Mail, Phone, Calendar, Search, Edit, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null)
  const [editedPatient, setEditedPatient] = useState<any>({})

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllPatients()
      setPatients(response.data || [])
    } catch (error: any) {
      toast.error('Erreur lors du chargement des patients')
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient: any) =>
    `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (patient: any) => {
    setEditingPatientId(patient._id)
    setEditedPatient({
      prenom: patient.prenom,
      nom: patient.nom,
      email: patient.email,
      tel: patient.tel || '',
      date_naissance: patient.date_naissance || '',
      maladie: patient.maladie || '',
      description_maladie: patient.description_maladie || '',
      doctor_id: patient.doctor_id || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingPatientId(null)
    setEditedPatient({})
  }

  const handleSave = async (patientId: string) => {
    try {
      // Filtrer les champs vides pour ne pas envoyer de valeurs null
      const dataToSend = Object.fromEntries(
        Object.entries(editedPatient).filter(([_, v]) => v !== '')
      )
      
      await patientAPI.update(patientId, dataToSend)
      toast.success('Patient mis à jour avec succès')
      setEditingPatientId(null)
      loadPatients() // Recharger la liste des patients
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du patient')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await patientAPI.delete(patientId)
        toast.success('Patient supprimé avec succès')
        loadPatients() // Recharger la liste des patients
      } catch (error) {
        toast.error('Erreur lors de la suppression du patient')
        console.error('Delete error:', error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedPatient(prev => ({
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
          <h1 className="text-2xl font-bold text-medical-900">Gestion des patients</h1>
          <p className="text-medical-600">Vue d'ensemble de tous les patients enregistrés</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-medical-600">Total patients</p>
            <p className="text-xl font-bold text-medical-900">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-medical-400" />
          <input
            type="text"
            placeholder="Rechercher un patient par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="card">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-medical-300 mx-auto mb-4" />
            <p className="text-medical-600">
              {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient: any) => (
              <div
                key={patient._id}
                className="border border-medical-200 rounded-lg p-6 hover:bg-medical-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      {editingPatientId === patient._id ? (
                        <div className="flex space-x-2 w-full">
                          <input
                            type="text"
                            name="prenom"
                            value={editedPatient.prenom}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Prénom"
                          />
                          <input
                            type="text"
                            name="nom"
                            value={editedPatient.nom}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Nom"
                          />
                        </div>
                      ) : (
                        <h3 className="text-lg font-semibold text-medical-900">
                          {patient.prenom} {patient.nom}
                        </h3>
                      )}
                      <span className="text-sm text-medical-500">
                        ID: {patient._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Mail className="h-4 w-4" />
                        {editingPatientId === patient._id ? (
                          <input
                            type="email"
                            name="email"
                            value={editedPatient.email}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Email"
                          />
                        ) : (
                          <span>{patient.email}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Phone className="h-4 w-4" />
                        {editingPatientId === patient._id ? (
                          <input
                            type="tel"
                            name="tel"
                            value={editedPatient.tel}
                            onChange={handleChange}
                            className="input-field flex-1"
                            placeholder="Téléphone"
                          />
                        ) : (
                          <span>{patient.tel || 'Non renseigné'}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Calendar className="h-4 w-4" />
                        {editingPatientId === patient._id ? (
                          <input
                            type="date"
                            name="date_naissance"
                            value={editedPatient.date_naissance}
                            onChange={handleChange}
                            className="input-field flex-1"
                          />
                        ) : (
                          <span>{patient.date_naissance ? `Né(e) le ${patient.date_naissance}` : 'Date de naissance non renseignée'}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      {editingPatientId === patient._id ? (
                        <input
                          type="text"
                          name="doctor_id"
                          value={editedPatient.doctor_id}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="ID du médecin assigné"
                        />
                      ) : (
                        patient.doctor_id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Médecin assigné: {patient.doctor_id}
                          </span>
                        )
                      )}
                    </div>
                    
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      {editingPatientId === patient._id ? (
                        <>
                          <input
                            type="text"
                            name="maladie"
                            value={editedPatient.maladie}
                            onChange={handleChange}
                            className="input-field w-full mb-2"
                            placeholder="Condition médicale"
                          />
                          <textarea
                            name="description_maladie"
                            value={editedPatient.description_maladie}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Description de la condition"
                            rows={3}
                          />
                        </>
                      ) : (
                        <>
                          {patient.maladie && (
                            <>
                              <p className="text-sm font-medium text-yellow-800">
                                Condition: {patient.maladie}
                              </p>
                              {patient.description_maladie && (
                                <p className="text-sm text-yellow-700 mt-1">
                                  {patient.description_maladie}
                                </p>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {editingPatientId === patient._id ? (
                      <>
                        <button
                          onClick={() => handleSave(patient._id)}
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
                          onClick={() => handleEdit(patient)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient._id)}
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
    </div>
  )
}