// src/pages/UserLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { loginUser } from '../../services/api';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await loginUser(formData);
      const token = response.data;
      localStorage.setItem('token', token);

      // Decode the JWT token to extract the role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const role = payload.role;

      localStorage.setItem('role', role);

      if (role === 'ADMIN') {
        toast.error('Please use Admin Login');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return;
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login successful!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          User Login
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Forgot your password?{' '}
          <a href="/password-reset" className="text-blue-600 hover:underline">
            Reset it
          </a>
        </p>
        <p className="mt-2 text-center">
          Don't have an account?{' '}
          <a href="/user-register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default UserLogin;