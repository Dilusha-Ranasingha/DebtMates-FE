// src/pages/RotationalPlanPages/CreateRotationalPlan.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import toast from 'react-hot-toast';

const CreateRotationalPlan = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // Dummy data
  const dummyGroup = {
    groupId: parseInt(groupId),
    groupName: 'Updated Friends Savings',
    numMembers: 5,
    isCreator: true,
  };

  const dummyMembers = [
    { id: 1, username: 'Member 1' },
    { id: 2, username: 'Member 2' },
    { id: 3, username: 'Member 3' },
    { id: 4, username: 'Member 4' },
    { id: 5, username: 'Member 5' },
  ];

  const [members] = useState(dummyMembers);
  const [planData, setPlanData] = useState(
    Array.from({ length: dummyGroup.numMembers }, (_, index) => ({
      monthNumber: index + 1,
      recipientId: '',
      amount: '',
    }))
  );

  const handlePlanChange = (index, field, value) => {
    const updatedPlan = [...planData];
    updatedPlan[index] = { ...updatedPlan[index], [field]: value };
    setPlanData(updatedPlan);
  };

  const handleSubmit = (e) => {
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

    // Simulate successful plan creation
    toast.success('Plan created successfully');
    navigate(`/rotational/${groupId}/payments`);
  };

  if (!dummyGroup.isCreator) {
    toast.error('You are not authorized to create a plan for this group');
    navigate(`/rotational/${groupId}/payments`);
    return null;
  }

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