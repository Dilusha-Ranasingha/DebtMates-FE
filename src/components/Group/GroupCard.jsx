// src/components/Group/GroupCard.jsx
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const { groupId, groupName, groupDescription, numMembers, isCreator } = group;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-lg font-bold text-blue-700">{groupName}</h3>
      <p className="text-gray-600">{groupDescription}</p>
      <p className="text-sm text-gray-500">Group Id: {groupId}</p>
      <p className="text-sm text-gray-500">Members: {numMembers}</p>


      <div className="mt-4 space-x-2">
        <Link to={`/groups/${group.groupId}/debts`} className="btn-primary">
          View Debts
        </Link>
        {isCreator && (
          <Link to={`/groups/${groupId.groupId}`} className="btn-secondary">
            Edit
          </Link>
        )}
      </div>

      
    </div>
  );
};

export default GroupCard;