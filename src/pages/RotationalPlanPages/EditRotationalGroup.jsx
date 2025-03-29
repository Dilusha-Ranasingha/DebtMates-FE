// src/pages/RotationalPlanPages/EditRotationalGroup.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRotational from '../../hooks/useRotational';
import InputField from '../../components/InputField';
import validateForm from '../../utils/validateForm';
import { getRotationalGroups } from '../../services/api';
import toast from 'react-hot-toast'; // Added toast for better UX

const EditRotationalGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { updateExistingGroup } = useRotational();
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
        const response = await getRotationalGroups();
        const group = response.data.find((g) => g.groupId === parseInt(groupId));
        if (group && group.creator) {
          setFormData({
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            numMembers: group.numMembers,
          });
        } else {
          toast.error('You are not authorized to edit this group');
          navigate('/rotational-page');
        }
      } catch (error) {
        toast.error('Failed to fetch group details');
        navigate('/rotational-page');
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
      toast.success('Group updated successfully');
      navigate('/rotational-page');
    } catch (error) {
      toast.error('Error updating group');
      console.error('Error updating group:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Edit Rotational Group
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

export default EditRotationalGroup;