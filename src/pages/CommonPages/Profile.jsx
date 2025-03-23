// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { getProfile, updateProfile, changePassword } from '../../services/api';
import evaluatePasswordStrength from '../../utils/passwordStrength';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    strength: '',
    color: '',
    score: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        setUser(response.data);
        setFormData({ email: response.data.email });
      } catch (error) {
        toast.error('Failed to load profile');
        navigate('/user-login');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user-login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    if (name === 'newPassword') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else {
      if (passwordData.newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters';
      const strength = evaluatePasswordStrength(passwordData.newPassword);
      if (strength.score < 3) {
        newErrors.newPassword = newErrors.newPassword
          ? `${newErrors.newPassword} and must be at least Medium strength`
          : 'New password must be at least Medium strength';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Password changed successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setPasswordErrors({});
      setPasswordData({ currentPassword: '', newPassword: '' });
      setPasswordStrength({ strength: '', color: '', score: 0 });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to change password');
      setPasswordErrors({ general: error.response?.data || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            value={user.username}
            disabled
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
            label="Role"
            type="text"
            name="role"
            value={user.role}
            disabled
          />
          <button type="submit" className="w-full btn-primary" disabled={loading}>
            Update Profile
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full btn-secondary"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-4">
              <InputField
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
              />
              <InputField
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
              />
              {passwordData.newPassword && (
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
              {passwordErrors.general && (
                <p className="text-red-500 text-sm mt-2">{passwordErrors.general}</p>
              )}
              <button type="submit" className="w-full btn-primary" disabled={loading}>
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Profile;