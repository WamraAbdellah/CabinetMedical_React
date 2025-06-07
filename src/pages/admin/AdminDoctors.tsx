import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { UserCheck, User, Mail, Phone, Stethoscope, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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
                      <h3 className="text-lg font-semibold text-medical-900">
                        Dr. {doctor.prenom} {doctor.nom}
                      </h3>
                      <span className="text-sm text-medical-500">
                        ID: {doctor._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doctor.specialite}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
                      
                      {doctor.created_at && (
                        <div className="flex items-center space-x-2 text-medical-600">
                          <User className="h-4 w-4" />
                          <span>Inscrit le {new Date(doctor.created_at).toLocaleDateString()}</span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}