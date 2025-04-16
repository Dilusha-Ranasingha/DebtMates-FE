// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure the frontend sends the token to the backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Existing auth/user functions
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data, {
  headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' },
});
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (data) => api.put('/user/profile', data);
export const changePassword = (data) => api.post('/user/change-password', data);
export const getAllUsers = (page) => api.get(`/admin/users?page=${page}`);
export const getAllAdmins = (page) => api.get(`/admin/admins?page=${page}`);
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const requestPasswordReset = (data) => api.post('/auth/password-reset/request', data);
export const confirmPasswordReset = (data) => api.post('/auth/password-reset/confirm', data);
export const logout = () => api.post('/auth/logout');

// Group and debt functions
export const getUserGroups = () => api.get('/groups/me');
export const createGroup = (data) => api.post('/groups', data);
export const updateGroup = (groupId, data) => api.put(`/groups/${groupId}`, data);
export const getGroupDebts = (groupId) => api.get(`/groups/${groupId}/debts`);
export const addGroupMembers = (groupId, userIds) => api.post(`/groups/${groupId}/members`, { userIds });
export const recordDebt = (groupId, data) => api.post(`/groups/${groupId}/debts`, data);
export const getGroupMembers = (groupId) => api.get(`/groups/${groupId}/members`);
export const searchUsers = (query, searchBy = 'username') => api.get(`/user/search?${searchBy}=${query}`);

// Rotational savings functions
export const getRotationalGroups = () => api.get('/rotational/groups');
export const createRotationalGroup = (data) => api.post('/rotational/groups', data);
export const updateRotationalGroup = (groupId, data) => api.put(`/rotational/groups/${groupId}`, data);
export const addRotationalMembers = (groupId, memberIds) => api.post(`/rotational/groups/${groupId}/members`, { memberIds });
export const createRotationalPlan = (groupId, data) => api.post(`/rotational/groups/${groupId}/plan`, data);
export const getRotationalPayments = (groupId) => api.get(`/rotational/groups/${groupId}/payments`);
export const uploadPaymentSlip = (paymentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put(`/rotational/payments/${paymentId}/slip`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getPaymentSlip = (paymentId) => api.get(`/rotational/payments/${paymentId}/slip`);
export const deleteRotationalGroup = (groupId) => api.delete(`/rotational/groups/${groupId}`);
export const getRotationalGroupMembers = (groupId) => api.get(`/rotational/groups/${groupId}/members`);