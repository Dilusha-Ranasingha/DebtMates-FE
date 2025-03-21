// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) =>
  API.post('/auth/register', userData);

export const loginUser = (userData) =>
  API.post('/auth/login', userData);

export const logoutUser = () =>
  API.post('/auth/logout');

export const requestPasswordReset = (emailData) =>
  API.post('/auth/password-reset/request', emailData);

export const confirmPasswordReset = (resetData) =>
  API.post('/auth/password-reset/confirm', resetData);

export const getAllUsers = (page = 0, size = 10) =>
  API.get(`/admin/users?page=${page}&size=${size}`);

export const getAllAdmins = (page = 0, size = 10) =>
  API.get(`/admin/admins?page=${page}&size=${size}`);

export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);

export const getProfile = () =>
  API.get('/user/profile');

export const updateProfile = (profileData) =>
  API.put('/user/profile', profileData);

export const getUserById = (id) =>
  API.get(`/admin/users/${id}`);

export const updateUser = (id, userData) =>
  API.put(`/admin/users/${id}`, userData);