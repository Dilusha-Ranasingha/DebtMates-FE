// src/pages/RotationalPlanPages/RotationalPage.jsx
import { useNavigate } from 'react-router-dom';
import useRotational from '../../hooks/useRotational';
 import LoadingSpinner from '../../components/LoadingSpinner';
import RotationalGroupCard from './RotationalGroupCard';

const RotationalPage = () => {
  const navigate = useNavigate();
  const { groups, loading, deleteGroup } = useRotational();


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Rotational Savings Dashboard</h2>
          <button
            onClick={() => navigate('/rotational/create')}
            className="btn-primary"
          >
            Create Rotational Group
          </button>
        </div>
        {loading ? (
           <LoadingSpinner />
         ) : groups.length === 0 ? (
          <p className="text-gray-600">No rotational groups found. Create one to start!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <RotationalGroupCard
                key={group.groupId}
                group={group}
                onDelete={deleteGroup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RotationalPage;