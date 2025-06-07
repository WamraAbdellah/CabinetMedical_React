import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Bell } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-medical-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-medical-900">
            Cabinet Médical
          </h1>
          <p className="text-sm text-medical-600">
            Système de gestion médicale
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-medical-600 hover:text-medical-900 hover:bg-medical-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-medical-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-medical-600 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-medical-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}