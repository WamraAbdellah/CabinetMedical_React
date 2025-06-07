import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { doctorAPI } from '../../services/api'
import { Users, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    pending: 0,
    today: 0
  })
  const [pendingConsultations, setPendingConsultations] = useState([])
  const [recentConsultations, setRecentConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      const [patientsRes, consultationsRes, pendingRes] = await Promise.all([
        doctorAPI.getPatients(user._id),
        doctorAPI.getConsultations(user._id),
        doctorAPI.getPendingConsultations(user._id)
      ])
      
      const patients = patientsRes.data.patients || []
      const consultations = consultationsRes.data.consultations || []
      const pending = pendingRes.data.consultations || []
      
      // Calculate today's consultations
      const today = new Date().toISOString().split('T')[0]
      const todayConsultations = consultations.filter((c: any) => 
        c.date && c.date.startsWith(today)
      )
      
      setStats({
        patients: patients.length,
        consultations: consultations.length,
        pending: pending.length,
        today: todayConsultations.length
      })
      
      setPendingConsultations(pending.slice(0, 5))
      setRecentConsultations(consultations.slice(0, 5))
      
    } catch (error: any) {
      toast.error('Erreur lors du chargement des données')
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
      
      loadData() // Reload data
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
          Tableau de bord médecin
        </h1>
        <p className="text-medical-600">
          Bienvenue, Dr. {user?.prenom} {user?.nom}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Patients</p>
              <p className="text-2xl font-bold text-medical-900">
                {stats.patients}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Consultations</p>
              <p className="text-2xl font-bold text-medical-900">
                {stats.consultations}
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
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-medical-900">
                {stats.today}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Consultations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-medical-900 mb-4">
            Demandes en attente
          </h3>
          {pendingConsultations.length === 0 ? (
            <p className="text-medical-600 text-center py-8">
              Aucune demande en attente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingConsultations.map((consultation: any) => (
                <div
                  key={consultation._id}
                  className="border border-medical-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-medical-900">
                        Patient ID: {consultation.patient_id}
                      </p>
                      <p className="text-sm text-medical-600">
                        {consultation.date}
                      </p>
                    </div>
                    <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                      {consultation.etat}
                    </span>
                  </div>
                  
                  {consultation.description && (
                    <p className="text-sm text-medical-700 mb-3">
                      {consultation.description}
                    </p>
                  )}
                  
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Consultations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-medical-900 mb-4">
            Consultations récentes
          </h3>
          {recentConsultations.length === 0 ? (
            <p className="text-medical-600 text-center py-8">
              Aucune consultation récente
            </p>
          ) : (
            <div className="space-y-4">
              {recentConsultations.map((consultation: any) => (
                <div
                  key={consultation._id}
                  className="flex items-center justify-between p-4 bg-medical-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-medical-900">
                      Patient ID: {consultation.patient_id}
                    </p>
                    <p className="text-sm text-medical-600">
                      {consultation.date}
                    </p>
                    {consultation.description && (
                      <p className="text-sm text-medical-700 mt-1">
                        {consultation.description}
                      </p>
                    )}
                  </div>
                  <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                    {consultation.etat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}