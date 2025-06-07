import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Users, User, Mail, Phone, Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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
            Gestion des patients
          </h1>
          <p className="text-medical-600">
            Vue d'ensemble de tous les patients enregistrés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-medical-600">Total patients</p>
            <p className="text-xl font-bold text-medical-900">
              {patients.length}
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
                      <h3 className="text-lg font-semibold text-medical-900">
                        {patient.prenom} {patient.nom}
                      </h3>
                      <span className="text-sm text-medical-500">
                        ID: {patient._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-medical-600">
                        <Mail className="h-4 w-4" />
                        <span>{patient.email}</span>
                      </div>
                      
                      {patient.tel && (
                        <div className="flex items-center space-x-2 text-medical-600">
                          <Phone className="h-4 w-4" />
                          <span>{patient.tel}</span>
                        </div>
                      )}
                      
                      {patient.date_naissance && (
                        <div className="flex items-center space-x-2 text-medical-600">
                          <Calendar className="h-4 w-4" />
                          <span>Né(e) le {patient.date_naissance}</span>
                        </div>
                      )}
                    </div>
                    
                    {patient.doctor_id && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Médecin assigné: {patient.doctor_id}
                        </span>
                      </div>
                    )}
                    
                    {patient.maladie && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">
                          Condition: {patient.maladie}
                        </p>
                        {patient.description_maladie && (
                          <p className="text-sm text-yellow-700 mt-1">
                            {patient.description_maladie}
                          </p>
                        )}
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