// src/components/Group/GroupCard.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGroupDebts } from '../../services/api';

const GroupCard = ({ group }) => {
  const { groupId, groupName, groupDescription, numMembers, isCreator } = group;
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true);
      try {
        const response = await getGroupDebts(groupId);
        setDebts(response.data);
      } catch (error) {
        console.error('Failed to fetch debts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDebts();
  }, [groupId]);

  const totalDebt = debts.reduce((sum, debt) => sum + (debt.amountToPay || 0), 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-lg font-bold text-blue-700">{groupName}</h3>
      <p className="text-gray-600">{groupDescription}</p>
      <p className="text-sm text-gray-500">Group: {groupId}</p>
      <p className="text-sm text-gray-500">Members: {numMembers}</p>
      {loading ? (
        <p className="text-sm text-gray-500">Loading debts...</p>
      ) : (
        <p className="text-sm text-gray-500">Total Debt: ${totalDebt.toFixed(2)}</p>
      )}
      <div className="mt-4 space-x-2">
        <Link to={`/groups/${groupId}`} className="btn-primary">
          View Details
        </Link>
        {isCreator && (
          <>
            <Link to={`/groups/${groupId}/edit`} className="btn-secondary">
              Edit
            </Link>
            <Link to={`/groups/${groupId}/add-members`} className="btn-primary">
              Add Members
            </Link>
            <Link to={`/groups/${groupId}/record-debt`} className="btn-primary">
              Record Debt
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupCard;