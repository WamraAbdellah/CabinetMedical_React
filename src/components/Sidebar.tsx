import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  User,
  Calendar,
  Users,
  UserCheck,
  Settings,
  Activity,
  FileText,
  Clock,
  UserPlus
} from 'lucide-react'

const navigation = {
  patient: [
    { name: 'Tableau de bord', href: '/patient/dashboard', icon: Home },
    { name: 'Mon profil', href: '/patient/profile', icon: User },
    { name: 'Mes consultations', href: '/patient/consultations', icon: Calendar },
  ],
  doctor: [
    { name: 'Tableau de bord', href: '/doctor/dashboard', icon: Home },
    { name: 'Mon profil', href: '/doctor/profile', icon: User },
    { name: 'Mes patients', href: '/doctor/patients', icon: Users },
    { name: 'Consultations', href: '/doctor/consultations', icon: Calendar },
  ],
  admin: [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Médecins', href: '/admin/doctors', icon: UserCheck },
    { name: 'Demandes médecins', href: '/admin/pending-doctors', icon: Clock },
  ],
}

export default function Sidebar() {
  const { user } = useAuth()
  
  if (!user) return null

  const userNavigation = navigation[user.role] || []

  return (
    <div className="w-64 bg-white border-r border-medical-200 flex flex-col">
      <div className="p-6 border-b border-medical-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-medical-900">
              Cabinet
            </h2>
            <p className="text-sm text-medical-600">
              Médical
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {userNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-medical-700 hover:bg-medical-100 hover:text-medical-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-medical-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-medical-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-medical-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-medical-900 truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-medical-600 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}