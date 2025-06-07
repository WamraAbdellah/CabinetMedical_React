import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { patientAPI, doctorAPI } from '../../services/api'
import { Calendar, User, Clock, Plus, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [doctor, setDoctor] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewConsultation, setShowNewConsultation] = useState(false)
  const [newConsultation, setNewConsultation] = useState({
    doctor_id: '',
    date: '',
    description: ''
  })

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Load consultations
      const consultationsRes = await patientAPI.getConsultations(user._id)
      setConsultations(consultationsRes.data.consultations || [])
      
      // Load assigned doctor
      try {
        const doctorRes = await patientAPI.getDoctor(user._id)
        setDoctor(doctorRes.data)
      } catch (error) {
        // No doctor assigned yet
        setDoctor(null)
      }
      
      // Load all doctors for consultation booking
      const doctorsRes = await doctorAPI.list()
      setDoctors(doctorsRes.data.doctors || [])
      
    } catch (error: any) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newConsultation.doctor_id || !newConsultation.date) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      await patientAPI.createConsultation(user!._id, newConsultation)
      toast.success('Demande de consultation envoyée!')
      setShowNewConsultation(false)
      setNewConsultation({ doctor_id: '', date: '', description: '' })
      loadData()
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la création'
      toast.error(message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'demandée': return 'status-pending'
      case 'acceptée': return 'status-accepted'
      case 'rejetée': return 'status-rejected'
      case 'terminée': return 'status-completed'
      default: return 'status-pending'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-medical-900">
            Tableau de bord patient
          </h1>
          <p className="text-medical-600">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
        </div>
        <button
          onClick={() => setShowNewConsultation(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle consultation</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Consultations</p>
              <p className="text-2xl font-bold text-medical-900">
                {consultations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Médecin assigné</p>
              <p className="text-lg font-semibold text-medical-900">
                {doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Aucun'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">En attente</p>
              <p className="text-2xl font-bold text-medical-900">
                {consultations.filter(c => c.etat === 'demandée').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Doctor */}
      {doctor && (
        <div className="card">
          <h3 className="text-lg font-semibold text-medical-900 mb-4">
            Mon médecin
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-medical-900">
                Dr. {doctor.prenom} {doctor.nom}
              </h4>
              <p className="text-medical-600">{doctor.specialite}</p>
              <p className="text-sm text-medical-500">{doctor.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Consultations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-medical-900 mb-4">
          Mes consultations récentes
        </h3>
        {consultations.length === 0 ? (
          <p className="text-medical-600 text-center py-8">
            Aucune consultation pour le moment
          </p>
        ) : (
          <div className="space-y-4">
            {consultations.slice(0, 5).map((consultation: any) => (
              <div
                key={consultation._id}
                className="flex items-center justify-between p-4 bg-medical-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-medical-900">
                    {consultation.date}
                  </p>
                  <p className="text-sm text-medical-600">
                    {consultation.description || 'Consultation générale'}
                  </p>
                </div>
                <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                  {consultation.etat}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Consultation Modal */}
      {showNewConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-medical-900 mb-4">
              Nouvelle consultation
            </h3>
            <form onSubmit={handleCreateConsultation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Médecin
                </label>
                <select
                  value={newConsultation.doctor_id}
                  onChange={(e) => setNewConsultation({
                    ...newConsultation,
                    doctor_id: e.target.value
                  })}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionnez un médecin</option>
                  {doctors.map((doc: any) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.prenom} {doc.nom} - {doc.specialite}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Date et heure
                </label>
                <input
                  type="datetime-local"
                  value={newConsultation.date}
                  onChange={(e) => setNewConsultation({
                    ...newConsultation,
                    date: e.target.value
                  })}
                  className="input-field"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={newConsultation.description}
                  onChange={(e) => setNewConsultation({
                    ...newConsultation,
                    description: e.target.value
                  })}
                  className="input-field"
                  rows={3}
                  placeholder="Décrivez brièvement le motif de consultation..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewConsultation(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Demander
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}