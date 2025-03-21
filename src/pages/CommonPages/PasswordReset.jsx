// src/pages/PasswordReset.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import InputField from '../../components/InputField';
import { requestPasswordReset } from '../../services/api';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    try {
      await requestPasswordReset({ email });
      toast.success('Password reset instructions sent to your email.');
      navigate('/user-login');
    } catch (error) {
      toast.error(error.response?.data || 'Password reset request failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            error={error}
          />
          <button
            type="submit"
            className="w-full btn-primary"
          >
            Send Reset Instructions
          </button>
        </form>
        <p className="mt-4 text-center">
          Back to{' '}
          <a href="/user-login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default PasswordReset;