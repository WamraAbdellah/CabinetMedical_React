import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { Users, UserCheck, Clock, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    pendingDoctors: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      
      const [patientsRes, doctorsRes, pendingRes] = await Promise.all([
        adminAPI.getAllPatients(),
        adminAPI.getAllDoctors(),
        adminAPI.getPendingDoctors()
      ])
      
      setStats({
        patients: patientsRes.data.length || 0,
        doctors: doctorsRes.data.length || 0,
        pendingDoctors: pendingRes.data.length || 0
      })
      
    } catch (error: any) {
      toast.error('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
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
          Tableau de bord administrateur
        </h1>
        <p className="text-medical-600">
          Bienvenue, {user?.prenom} {user?.nom}
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
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Médecins</p>
              <p className="text-2xl font-bold text-medical-900">
                {stats.doctors}
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
              <p className="text-sm text-medical-600">Demandes en attente</p>
              <p className="text-2xl font-bold text-medical-900">
                {stats.pendingDoctors}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-medical-600">Système</p>
              <p className="text-lg font-semibold text-green-600">
                Actif
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-medical-900 mb-2">
              Gérer les patients
            </h3>
            <p className="text-medical-600 text-sm">
              Voir et gérer tous les patients enregistrés
            </p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-medical-900 mb-2">
              Gérer les médecins
            </h3>
            <p className="text-medical-600 text-sm">
              Voir et gérer tous les médecins approuvés
            </p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-medical-900 mb-2">
              Demandes d'accès
            </h3>
            <p className="text-medical-600 text-sm">
              Examiner les demandes d'accès des médecins
            </p>
            {stats.pendingDoctors > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.pendingDoctors} en attente
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-medical-900 mb-4">
          Activité récente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-medical-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-medical-900">
                Système initialisé
              </p>
              <p className="text-xs text-medical-600">
                Le système de gestion médicale est opérationnel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}