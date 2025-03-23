// src/components/InputField.jsx
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const InputField = ({ label, type, name, value, onChange, error, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;