import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRotational from '../../hooks/useRotational';
import { getRotationalGroups, getRotationalGroupMembers } from '../../services/api';
import InputField from '../../components/InputField';
import toast from 'react-hot-toast';

const CreateRotationalPlan = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { createPlan } = useRotational();
  const [members, setMembers] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [creator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [numMembers, setNumMembers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group details
        const groupsResponse = await getRotationalGroups();
        const group = groupsResponse.data.find((g) => g.groupId === parseInt(groupId));
        if (!group) {
          toast.error('Group not found');
          navigate('/rotational-page');
          return;
        }
        if (!group.creator) {
          toast.error('You are not authorized to create a plan for this group');
          navigate(`/rotational/${groupId}/payments`);
          return;
        }
        setIsCreator(true);
        setNumMembers(group.numMembers);

        // Fetch group members
        const membersResponse = await getRotationalGroupMembers(groupId);
        setMembers(membersResponse.data);

        // Initialize plan data based on numMembers
        const initialPlan = Array.from({ length: group.numMembers }, (_, index) => ({
          monthNumber: index + 1,
          recipientId: '',
          amount: '',
        }));
        setPlanData(initialPlan);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch group details: ' + (error.response?.data?.message || error.message));
        navigate('/rotational-page');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, navigate]);

  const handlePlanChange = (index, field, value) => {
    const updatedPlan = [...planData];
    updatedPlan[index] = { ...updatedPlan[index], [field]: value };
    setPlanData(updatedPlan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the plan
    for (let i = 0; i < planData.length; i++) {
      const plan = planData[i];
      if (!plan.recipientId) {
        toast.error(`Please select a recipient for month ${i + 1}`);
        return;
      }
      if (!plan.amount || parseFloat(plan.amount) <= 0) {
        toast.error(`Please enter a valid amount for month ${i + 1}`);
        return;
      }
    }

    try {
      await createPlan(groupId, planData);
      toast.success('Plan created successfully');
      navigate(`/rotational/${groupId}/payments`);
    } catch (error) {
      toast.error('Error creating plan: ' + (error.response?.data?.message || error.message));
      console.error('Error creating plan:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!creator) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create Rotational Plan
        </h2>
        <form onSubmit={handleSubmit}>
          {planData.map((plan, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-bold mb-2">Month {plan.monthNumber}</h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Recipient</label>
                <select
                  value={plan.recipientId}
                  onChange={(e) => handlePlanChange(index, 'recipientId', e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    !plan.recipientId ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Recipient</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.username}
                    </option>
                  ))}
                </select>
                {!plan.recipientId && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a recipient for this month.
                  </p>
                )}
              </div>
              <InputField
                label="Amount"
                type="number"
                name={`amount-${index}`}
                value={plan.amount}
                onChange={(e) => handlePlanChange(index, 'amount', e.target.value)}
                className={!plan.amount || parseFloat(plan.amount) <= 0 ? 'border-red-500' : ''}
              />
              {(!plan.amount || parseFloat(plan.amount) <= 0) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid positive amount.
                </p>
              )}
            </div>
          ))}
          <button type="submit" className="w-full btn-primary">
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRotationalPlan;