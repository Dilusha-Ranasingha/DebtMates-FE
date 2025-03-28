// src/pages/AdminRegister.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { registerUser } from '../../services/api';
import evaluatePasswordStrength from '../../utils/passwordStrength';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    strength: '',
    color: '',
    score: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const strength = evaluatePasswordStrength(formData.password);
      if (strength.score < 3) {
        newErrors.password = 'Password must be at least Medium strength';
      }
    }
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login as SuperAdmin to register an admin');
        navigate('/admin-login');
        return;
      }
      await registerUser(formData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Admin registration successful! Please login.",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/admin-login');
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <>

    <div className="text-left mb-4">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
      <span className="mr-1">&laquo;</span> Back
      </button>
    </div>
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Admin Register
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
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          {formData.password && (
            <div className="mb-4">
              <div className="text-sm text-gray-700">
                Password Strength: <span className={`font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.strength}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className={`h-2.5 rounded-full ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          <button type="submit" className="w-full btn-primary">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/admin-login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
      
    </div>
    </>
  );
};

export default AdminRegister;
