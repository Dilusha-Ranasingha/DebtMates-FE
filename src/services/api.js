// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//This is ensure the Frontend Sends the Token to the Backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;      //This token stored in the local storage
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