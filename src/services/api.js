import axios from 'axios';
const API_BASE_URL = '/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Auth API
export const authAPI = {
    login: (email, mot_de_passe) => api.post('/auth/login', { email, mot_de_passe }),
};
// Patient API
export const patientAPI = {
    create: (data) => api.post('/patient', data),
    get: (id) => api.get(`/patient/${id}`),
    update: (id, data) => api.put(`/patient/${id}`, data),
    delete: (id) => api.delete(`/patient/${id}`),
    list: () => api.get('/patient'),
    getConsultations: (id) => api.get(`/patient/${id}/consultations`),
    getDoctor: (id) => api.get(`/patient/${id}/doctor`),
    assignDoctor: (patientId, doctorId) => api.post(`/patient/${patientId}/assign-doctor/${doctorId}`),
    createConsultation: (id, data) => api.post(`/patient/${id}/consultations`, data),
};
// Doctor API
export const doctorAPI = {
    create: (data) => api.post('/doctor', data),
    get: (id) => api.get(`/doctor/${id}`),
    update: (id, data) => api.put(`/doctor/${id}`, data),
    delete: (id) => api.delete(`/doctor/${id}`),
    list: () => api.get('/doctor'),
    getPatients: (id) => api.get(`/doctor/${id}/patients`),
    getConsultations: (id) => api.get(`/doctor/${id}/consultations`),
    getPendingConsultations: (id) => api.get(`/doctor/${id}/consultations/pending`),
    acceptConsultation: (doctorId, consultationId) => api.post(`/doctor/${doctorId}/consultations/${consultationId}/accept`),
    rejectConsultation: (doctorId, consultationId) => api.post(`/doctor/${doctorId}/consultations/${consultationId}/reject`),
    submitRequest: (data) => api.post('/doctor/admin/request', data),
};
// Admin API
export const adminAPI = {
    getAllPatients: () => api.get('/admin/patients'),
    getAllDoctors: () => api.get('/admin/doctors'),
    getPendingDoctors: () => api.get('/admin/pending-doctors'),
    reviewDoctor: (doctorId, data) => api.post(`/admin/review-doctor/${doctorId}`, data),
    createAdmin: (data) => api.post('/admin/create-admin', data),
};
// Test API
export const testAPI = {
    testMongoDB: () => api.get('/test'),
    testNeo4j: () => api.get('/test_neo4j'),
};
export default api;
