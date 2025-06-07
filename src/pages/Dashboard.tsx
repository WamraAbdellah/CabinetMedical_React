import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'patient':
      return <Navigate to="/patient/dashboard\" replace />
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />
    default:
      return <Navigate to="/login" replace />
  }
}