import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API
export const authAPI = {
  login: (email: string, mot_de_passe: string) =>
    api.post('/auth/login', { email, mot_de_passe }),
}

// Patient API
export const patientAPI = {
  create: (data: any) => api.post('/patient', data),
  get: (id: string) => api.get(`/patient/${id}`),
  update: (id: string, data: any) => api.put(`/patient/${id}`, data),
  delete: (id: string) => api.delete(`/patient/${id}`),
  list: () => api.get('/patient'),
  getConsultations: (id: string) => api.get(`/patient/${id}/consultations`),
  getDoctor: (id: string) => api.get(`/patient/${id}/doctor`),
  assignDoctor: (patientId: string, doctorId: string) =>
    api.post(`/patient/${patientId}/assign-doctor/${doctorId}`),
  createConsultation: (id: string, data: any) =>
    api.post(`/patient/${id}/consultations`, data),
}

// Doctor API
export const doctorAPI = {
  create: (data: any) => api.post('/doctor', data),
  get: (id: string) => api.get(`/doctor/${id}`),
  update: (id: string, data: any) => api.put(`/doctor/${id}`, data),
  delete: (id: string) => api.delete(`/doctor/${id}`),
  list: () => api.get('/doctor'),
  getPatients: (id: string) => api.get(`/doctor/${id}/patients`),
  getConsultations: (id: string) => api.get(`/doctor/${id}/consultations`),
  getPendingConsultations: (id: string) => api.get(`/doctor/${id}/consultations/pending`),
  acceptConsultation: (doctorId: string, consultationId: string) =>
    api.post(`/doctor/${doctorId}/consultations/${consultationId}/accept`),
  rejectConsultation: (doctorId: string, consultationId: string) =>
    api.post(`/doctor/${doctorId}/consultations/${consultationId}/reject`),
  submitRequest: (data: any) => api.post('/doctor/admin/request', data),
}

// Admin API
export const adminAPI = {
  getAllPatients: () => api.get('/admin/patients'),
  getAllDoctors: () => api.get('/admin/doctors'),
  getPendingDoctors: () => api.get('/admin/pending-doctors'),
  reviewDoctor: (doctorId: string, data: any) =>
    api.post(`/admin/review-doctor/${doctorId}`, data),
  createAdmin: (data: any) => api.post('/admin/create-admin', data),
}

// Test API
export const testAPI = {
  testMongoDB: () => api.get('/test'),
  testNeo4j: () => api.get('/test_neo4j'),
}

export default api