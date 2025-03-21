// src/components/InputField.jsx
const InputField = ({ label, type, name, value, onChange, error }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };
  
  export default InputField;