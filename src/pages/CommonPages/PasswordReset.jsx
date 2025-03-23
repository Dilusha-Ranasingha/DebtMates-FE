// src/pages/PasswordReset.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { requestPasswordReset, confirmPasswordReset } from '../../services/api';
import evaluatePasswordStrength from '../../utils/passwordStrength';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' or 'confirm'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    strength: '',
    color: '',
    score: 0,
  });

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    const strength = evaluatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleRequestSubmit = async (e) => {
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
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "OTP sent to your email. Please check your inbox.",
        showConfirmButton: false,
        timer: 1500,
      });
      setStep('confirm');
      setError('');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send OTP');
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    const strength = evaluatePasswordStrength(newPassword);
    if (strength.score < 3) {
      setError('New password must be at least Medium strength');
      return;
    }

    try {
      await confirmPasswordReset({ email, otp, newPassword });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Password reset successfully. Please login with your new password.",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/user-login');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to reset password');
      setError(error.response?.data || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Reset Password
        </h2>
        {step === 'request' ? (
          <form onSubmit={handleRequestSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <button type="submit" className="w-full btn-primary">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              disabled
            />
            <InputField
              label="OTP"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
            />
            <InputField
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={error}
            />
            {newPassword && (
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
              Reset Password
            </button>
          </form>
        )}
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