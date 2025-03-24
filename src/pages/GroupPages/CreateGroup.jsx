// src/pages/GroupPages/CreateGroup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroup from '../../hooks/useGroup';
import InputField from '../../components/InputField';
import validateForm from '../../utils/validateForm';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { createNewGroup } = useGroup();     // get the createNewGroup function from the useGroup hook. that function is used to create a new group
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    numMembers: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, ['groupName', 'numMembers']);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createNewGroup(formData);         // call the createNewGroup function with the formData as an argument
      navigate('/dashboard');
    } catch (error) {
      // Error handled in useGroup hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create Group
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Group Name"
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            error={errors.groupName}
          />
          <InputField
            label="Description"
            type="text"
            name="groupDescription"
            value={formData.groupDescription}
            onChange={handleChange}
          />
          <InputField
            label="Number of Members"
            type="number"
            name="numMembers"
            value={formData.numMembers}
            onChange={handleChange}
            error={errors.numMembers}
          />
          <button type="submit" className="w-full btn-primary">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;