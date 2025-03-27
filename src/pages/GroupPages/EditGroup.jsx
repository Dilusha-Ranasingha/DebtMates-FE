// src/pages/GroupPages/EditGroup.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGroup from '../../hooks/useGroup';
import InputField from '../../components/InputField';
import validateForm from '../../utils/validateForm';
import { getUserGroups } from '../../services/api';

const EditGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { updateExistingGroup } = useGroup();
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    numMembers: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getUserGroups();
        const group = response.data.find((g) => g.groupId === parseInt(groupId));
        if (group && group.isCreator) {
          setFormData({
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            numMembers: group.numMembers,
          });
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId, navigate]);

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
      await updateExistingGroup(groupId, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Edit Group
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
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditGroup;