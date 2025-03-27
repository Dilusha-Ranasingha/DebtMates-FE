// src/pages/GroupPages/RecordDebt.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupMembers, getUserGroups, recordDebt } from '../../services/api';
import InputField from '../../components/InputField';
import toast from 'react-hot-toast';

const RecordDebt = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ totalBill: '' });
  const [contributions, setContributions] = useState({});
  const [errors, setErrors] = useState({});
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Fetch group members
        const membersResponse = await getGroupMembers(groupId);
        setMembers(membersResponse.data);
        const initialContributions = membersResponse.data.reduce((acc, member) => ({
          ...acc,
          [member.id]: '',
        }), {});
        setContributions(initialContributions);

        // Check if the user is the creator
        const groupsResponse = await getUserGroups();
        const group = groupsResponse.data.find((g) => g.groupId === parseInt(groupId));
        if (!group) {
          throw new Error('Group not found in user’s groups');
        }
        setIsCreator(group.isCreator);
      } catch (error) {
        setFetchError(error.response?.data?.message || 'Failed to load group members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [groupId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContributionChange = (memberId, value) => {
    setContributions({ ...contributions, [memberId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalBill = parseFloat(formData.totalBill);
    if (!totalBill || totalBill <= 0) {
      setErrors({ totalBill: 'Total bill must be a positive number' });
      return;
    }

    // Validate contributions
    const totalContributions = Object.values(contributions)
      .reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
    if (totalContributions !== totalBill) {
      setErrors({ contributions: 'Total contributions must equal the total bill' });
      return;
    }

    const debtData = {
      totalBill: totalBill,
      contributions: Object.entries(contributions).map(([memberId, amount]) => ({
        memberId: parseInt(memberId),
        amount: parseFloat(amount) || 0,
      })),
    };

    try {
      await recordDebt(groupId, debtData); // Directly use recordDebt
      toast.success('Debt recorded successfully');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to record debt';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Error</h2>
          <p className="text-gray-600 text-center">{fetchError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 w-full btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Not Authorized</h2>
          <p className="text-gray-600 text-center">Only the group creator can record debts.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 w-full btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Record Debt
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Total Bill"
            type="number"
            name="totalBill"
            value={formData.totalBill}
            onChange={handleChange}
            error={errors.totalBill}
          />
          {errors.contributions && (
            <p className="text-red-500 text-sm mt-2">{errors.contributions}</p>
          )}
          <h3 className="text-lg font-bold mb-4">Contributions</h3>
          {members.map((member) => (
            <InputField
              key={member.id}
              label={`${member.username}`}
              type="number"
              name={member.id.toString()}
              value={contributions[member.id]}
              onChange={(e) => handleContributionChange(member.id, e.target.value)}
            />
          ))}
          <button type="submit" className="w-full btn-primary">
            Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordDebt;