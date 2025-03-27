// src/pages/GroupPages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import useGroup from '../../hooks/useGroup';
import GroupCard from '../../components/Group/GroupCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { groups, loading } = useGroup();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Manage Your Debts</h2>
          <button
            onClick={() => navigate('/groups/create')}
            className="btn-primary"
          >
            Create Group
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : groups.length === 0 ? (
          <p className="text-gray-600">No groups found. Create one to start!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <GroupCard key={group.groupId} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;