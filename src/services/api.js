// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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