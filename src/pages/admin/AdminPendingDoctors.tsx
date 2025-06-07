import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { Clock, User, Mail, Phone, Stethoscope, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPendingDoctors() {
  const { user } = useAuth()
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadPendingDoctors()
  }, [])

  const loadPendingDoctors = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getPendingDoctors()
      setPendingDoctors(response.data || [])
    } catch (error: any) {
      toast.error('Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewDoctor = async (doctorId: string, action: 'approve' | 'reject', reason?: string) => {
    if (!user) return
    
    setActionLoading(doctorId)
    try {
      await adminAPI.reviewDoctor(doctorId, {
        action,
        admin_id: user._id,
        reason: reason || ''
      })
      
      toast.success(
        action === 'approve' 
          ? 'Médecin approuvé avec succès!' 
          : 'Demande rejetée'
      )
      
      loadPendingDoctors() // Reload the list
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l\'action'
      toast.error(message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = (doctorId: string) => {
    const reason = prompt('Raison du rejet (optionnel):')
    if (reason !== null) { // User didn't cancel
      handleReviewDoctor(doctorId, 'reject', reason)
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
            Demandes d'accès médecins
          </h1>
          <p className="text-medical-600">
            Examinez et approuvez les demandes d'accès des médecins
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-medical-600">En attente</p>
            <p className="text-xl font-bold text-medical-900">
              {pendingDoctors.length}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Doctors List */}
      <div className="card">
        {pendingDoctors.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-medical-300 mx-auto mb-4" />
            <p className="text-medical-600">
              Aucune demande en attente
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingDoctors.map((doctor: any) => (
              <div
                key={doctor._id}
                className="border border-medical-200 rounded-lg p-6 bg-yellow-50"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-6 w-6 text-yellow-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-medical-900">
                        Dr. {doctor.prenom} {doctor.nom}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          En attente
                        </span>
                        <span className="text-sm text-medical-500">
                          {new Date(doctor.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doctor.specialite}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Mail className="h-4 w-4" />
                        <span>{doctor.email}</span>
                      </div>
                      
                      {doctor.tel && (
                        <div className="flex items-center space-x-2 text-medical-600">
                          <Phone className="h-4 w-4" />
                          <span>{doctor.tel}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReviewDoctor(doctor._id, 'approve')}
                        disabled={actionLoading === doctor._id}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {actionLoading === doctor._id ? (
                          <div className="loading-spinner h-4 w-4"></div>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Approuver</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleReject(doctor._id)}
                        disabled={actionLoading === doctor._id}
                        className="btn-danger flex items-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Rejeter</span>
                      </button>
                    </div>
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