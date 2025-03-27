// src/pages/GroupPages/AddMembers.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberSelector from '../../components/Group/MemberSelector';
import { addGroupMembers, getUserGroups } from '../../services/api';
import useGroup from '../../hooks/useGroup';
import toast from 'react-hot-toast';

const AddMembers = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { fetchGroups } = useGroup();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkCreator = async () => {
      try {
        const response = await getUserGroups();
        const group = response.data.find((g) => g.groupId === parseInt(groupId));
        if (group && group.isCreator) {
          setIsCreator(true);
        } else {
          navigate(`/groups/${groupId}`);
        }
      } catch (error) {
        navigate('/dashboard');
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
      await addGroupMembers(groupId, selectedMembers);
      toast.success('Members added successfully');
      await fetchGroups(); // Refresh group list
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add members');
    }
  };

  if (!isCreator) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Add Members
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

export default AddMembers;