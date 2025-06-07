import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { doctorAPI } from '../../services/api'
import { Calendar, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DoctorConsultations() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadConsultations()
  }, [user])

  const loadConsultations = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await doctorAPI.getConsultations(user._id)
      setConsultations(response.data.consultations || [])
    } catch (error: any) {
      toast.error('Erreur lors du chargement des consultations')
    } finally {
      setLoading(false)
    }
  }

  const handleConsultationAction = async (consultationId: string, action: 'accept' | 'reject') => {
    if (!user) return
    
    try {
      if (action === 'accept') {
        await doctorAPI.acceptConsultation(user._id, consultationId)
        toast.success('Consultation acceptée')
      } else {
        await doctorAPI.rejectConsultation(user._id, consultationId)
        toast.success('Consultation rejetée')
      }
      
      loadConsultations() // Reload data
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l\'action'
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

  const filteredConsultations = consultations.filter((consultation: any) => {
    if (filter === 'all') return true
    return consultation.etat === filter
  })

  const stats = {
    total: consultations.length,
    pending: consultations.filter((c: any) => c.etat === 'demandée').length,
    accepted: consultations.filter((c: any) => c.etat === 'acceptée').length,
    completed: consultations.filter((c: any) => c.etat === 'terminée').length
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
      <div>
        <h1 className="text-2xl font-bold text-medical-900">
          Mes consultations
        </h1>
        <p className="text-medical-600">
          Gérez vos rendez-vous et demandes de consultation
        </p>
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
                {stats.total}
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
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Acceptées</p>
              <p className="text-xl font-bold text-medical-900">
                {stats.accepted}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Terminées</p>
              <p className="text-xl font-bold text-medical-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-medical-600" />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-medical-600 hover:bg-medical-100'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('demandée')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'demandée'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-medical-600 hover:bg-medical-100'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('acceptée')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'acceptée'
                  ? 'bg-green-100 text-green-700'
                  : 'text-medical-600 hover:bg-medical-100'
              }`}
            >
              Acceptées
            </button>
            <button
              onClick={() => setFilter('terminée')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'terminée'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-medical-600 hover:bg-medical-100'
              }`}
            >
              Terminées
            </button>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-medical-900 mb-4">
          Liste des consultations
        </h3>
        
        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-medical-300 mx-auto mb-4" />
            <p className="text-medical-600">
              {filter === 'all' ? 'Aucune consultation' : `Aucune consultation ${filter}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.map((consultation: any) => (
              <div
                key={consultation._id}
                className="border border-medical-200 rounded-lg p-4 hover:bg-medical-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-medium text-medical-900">
                        Patient ID: {consultation.patient_id}
                      </h4>
                      <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                        {getStatusText(consultation.etat)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-medical-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{consultation.date}</span>
                      </div>
                    </div>
                    
                    {consultation.description && (
                      <p className="text-sm text-medical-700 mb-3">
                        {consultation.description}
                      </p>
                    )}
                    
                    {consultation.etat === 'demandée' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConsultationAction(consultation._id, 'accept')}
                          className="btn-primary flex items-center space-x-1 text-sm px-3 py-1.5"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accepter</span>
                        </button>
                        <button
                          onClick={() => handleConsultationAction(consultation._id, 'reject')}
                          className="btn-danger flex items-center space-x-1 text-sm px-3 py-1.5"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Rejeter</span>
                        </button>
                      </div>
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