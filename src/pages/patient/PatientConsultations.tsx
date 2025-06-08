import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { patientAPI, doctorAPI,adminAPI } from '../../services/api'
import { Calendar, Clock, User, Plus, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function PatientConsultations() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any>([])
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
      
      const [consultationsRes, doctorsRes] = await Promise.all([
        patientAPI.getConsultations(user._id),
        adminAPI.getAllDoctors()
      ])
      console.log(doctorsRes)
      setConsultations(consultationsRes.data.consultations || [])
      setDoctors(doctorsRes.data|| [])
      
    } catch (error: any) {
      toast.error('Erreur lors du chargement des consultations')
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
      // Convert datetime-local to the format expected by backend
      const formattedDate = new Date(newConsultation.date)
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ')

      await patientAPI.createConsultation(user!._id, {
        ...newConsultation,
        date: formattedDate
      })
      
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'demandée': return 'En attente'
      case 'acceptée': return 'Acceptée'
      case 'rejetée': return 'Rejetée'
      case 'terminée': return 'Terminée'
      default: return status
    }
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d: any) => d._id === doctorId)
    return doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu'
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
            Mes consultations
          </h1>
          <p className="text-medical-600">
            Gérez vos rendez-vous médicaux
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Total</p>
              <p className="text-xl font-bold text-medical-900">
                {consultations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">En attente</p>
              <p className="text-xl font-bold text-medical-900">
                {consultations.filter((c: any) => c.etat === 'demandée').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Acceptées</p>
              <p className="text-xl font-bold text-medical-900">
                {consultations.filter((c: any) => c.etat === 'acceptée').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Terminées</p>
              <p className="text-xl font-bold text-medical-900">
                {consultations.filter((c: any) => c.etat === 'terminée').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-medical-900 mb-4">
          Historique des consultations
        </h3>
        
        {consultations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-medical-300 mx-auto mb-4" />
            <p className="text-medical-600">Aucune consultation pour le moment</p>
            <button
              onClick={() => setShowNewConsultation(true)}
              className="btn-primary mt-4"
            >
              Planifier une consultation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation: any) => (
              <div
                key={consultation._id}
                className="border border-medical-200 rounded-lg p-4 hover:bg-medical-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-medium text-medical-900">
                        {getDoctorName(consultation.doctor_id)}
                      </h4>
                      <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                        {getStatusText(consultation.etat)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-medical-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{consultation.date_str}</span>
                      </div>
                    </div>
                    
                    {consultation.description && (
                      <p className="mt-2 text-sm text-medical-700">
                        {consultation.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Consultation Modal */}
      {showNewConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-medical-900 mb-4">
              Nouvelle consultation
            </h3>
            <form onSubmit={handleCreateConsultation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Médecin *
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
                  Date et heure *
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

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewConsultation(false)
                    setNewConsultation({ doctor_id: '', date: '', description: '' })
                  }}
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