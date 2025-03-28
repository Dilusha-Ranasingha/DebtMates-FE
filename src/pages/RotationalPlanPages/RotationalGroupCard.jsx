// src/components/Rotational/RotationalGroupCard.jsx
import { Link } from 'react-router-dom';
import Dialog from '../../components/Dialog';
import { useState } from 'react';

const RotationalGroupCard = ({ group, onDelete }) => {
  const { groupId, groupName, groupDescription, numMembers, isCreator } = group;
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(groupId);
    setDeleteDialog(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-lg font-bold text-blue-700">{groupName}</h3>
      <p className="text-gray-600">{groupDescription}</p>
      <p className="text-sm text-gray-500">Group ID: {groupId}</p>
      <p className="text-sm text-gray-500">Members: {numMembers}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/rotational/${groupId}/payments`} className="btn-primary">
          View Rotational Payments
        </Link>
        {isCreator && (
          <>
            <Link to={`/rotational/groups/${groupId}`} className="btn-secondary">
              Edit Group
            </Link>
            <button
              onClick={() => setDeleteDialog(true)}
              className="btn-danger"
            >
              Delete Group
            </button>
            <Link to={`/rotational/groups/${groupId}/members`} className="btn-primary">
              Add Members
            </Link>
            <Link to={`/rotational/groups/${groupId}/plan`} className="btn-primary">
              Add Plan
            </Link>
          </>
        )}
      </div>
      <Dialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this group?"
      />
    </div>
  );
};

export default RotationalGroupCard;