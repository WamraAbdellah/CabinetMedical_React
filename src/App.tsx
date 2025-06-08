import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import PatientProfile from './pages/patient/PatientProfile'
import PatientConsultations from './pages/patient/PatientConsultations'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorPatients from './pages/doctor/DoctorPatients'
import DoctorConsultations from './pages/doctor/DoctorConsultations'
import AdminPatients from './pages/admin/AdminPatients'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminPendingDoctors from './pages/admin/AdminPendingDoctors'


function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard\" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard\" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard\" replace /> : <Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard\" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Patient Routes */}
        <Route path="patient">
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfile /></ProtectedRoute>} />
          <Route path="consultations" element={<ProtectedRoute allowedRoles={['patient']}><PatientConsultations /></ProtectedRoute>} />
        </Route>
        
        {/* Doctor Routes */}
        <Route path="doctor">
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile /></ProtectedRoute>} />
          <Route path="patients" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPatients /></ProtectedRoute>} />
          <Route path="consultations" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorConsultations /></ProtectedRoute>} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="admin">
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="patients" element={<ProtectedRoute allowedRoles={['admin']}><AdminPatients /></ProtectedRoute>} />
          <Route path="doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctors /></ProtectedRoute>} />
          <Route path="pending-doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminPendingDoctors /></ProtectedRoute>} />
        </Route>
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-medical-50">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App