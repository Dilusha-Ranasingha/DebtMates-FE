// src/pages/RotationalPlanPages/AddRotationalMembers.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberSelector from '../../components/Group/MemberSelector';
import useRotational from '../../hooks/useRotational';
import { getRotationalGroups } from '../../services/api';
import toast from 'react-hot-toast';

const AddRotationalMembers = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { addMembers } = useRotational();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkCreator = async () => {
      try {
        const response = await getRotationalGroups();
        const group = response.data.find((g) => g.groupId === parseInt(groupId));
        if (group && group.creator) {
          setIsCreator(true);
        } else {
          navigate(`/rotational/${groupId}/payments`);
        }
      } catch (error) {
        navigate('/rotational-page');
      }
    };
    checkCreator();
  }, [groupId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    try {
      await addMembers(groupId, selectedMembers);
      navigate('/rotational-page');
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  if (!creator) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Add Members to Rotational Group
        </h2>
        <form onSubmit={handleSubmit}>
          <MemberSelector
            onSelect={setSelectedMembers}
            selectedMembers={selectedMembers}
          />
          <button type="submit" className="w-full btn-primary">
            Add Members
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRotationalMembers;