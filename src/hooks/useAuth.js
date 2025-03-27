// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const useAuth = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate(role === 'ADMIN' ? '/admin-login' : '/user-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { token, role, isAuthenticated: !!token, logout: handleLogout };
};

export default useAuth;