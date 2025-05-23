// src/pages/GroupPages/GroupDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDebt from '../../hooks/useDebt';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserGroups } from '../../services/api';
import DebtTable from '../../components/Group/DebtTable';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { debts, loading: debtLoading, fetchDebts } = useDebt(groupId);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getUserGroups();
        const foundGroup = response.data.find((g) => g.groupId === parseInt(groupId));
        if (foundGroup) {
          setGroup(foundGroup);
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
    fetchDebts();
  }, [groupId, navigate, fetchDebts]);

  if (loading || debtLoading) return <LoadingSpinner />;

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">{group.groupName}</h2>
        <p className="text-gray-600 mb-4">{group.groupDescription}</p>
        <p className="text-gray-500 mb-6">Members: {group.numMembers}</p>
        {group.isCreator && (
          <div className="mb-6 space-x-4">
            <button
              onClick={() => navigate(`/groups/${groupId}/edit`)}
              className="btn-primary"
            >
              Edit Group
            </button>
            <button
              onClick={() => navigate(`/groups/${groupId}/add-members`)}
              className="btn-primary"
            >
              Add Members
            </button>
            <button
              onClick={() => navigate(`/groups/${groupId}/record-debt`)}
              className="btn-primary"
            >
              Record Debt
            </button>
          </div>
        )}
        <h3 className="text-xl font-bold text-blue-700 mb-4">Debt Summary</h3>
        <DebtTable debts={debts} />
      </div>
    </div>
  );
};

export default GroupDetails;