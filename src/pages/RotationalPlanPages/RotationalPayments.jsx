// src/pages/RotationalPlanPages/RotationalPayments.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRotational from '../../hooks/useRotational';
import { getRotationalGroups } from '../../services/api';
import RotationalPaymentTable from './RotationalPaymentTable';

const RotationalPayments = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { fetchPayments } = useRotational();
  const [payments, setPayments] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group details
        const groupsResponse = await getRotationalGroups();
        const foundGroup = groupsResponse.data.find((g) => g.groupId === parseInt(groupId));
        if (!foundGroup) {
          navigate('/rotational-page');
          return;
        }
        setGroup(foundGroup);

        // Fetch payments
        const paymentsResponse = await fetchPayments(groupId);
        setPayments(paymentsResponse);

        // Get current user ID from token
        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setCurrentUserId(payload.id);
      } catch (error) {
        navigate('/rotational-page');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, navigate, fetchPayments]);

  if (loading) return <div>Loading...</div>;
  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">{group.groupName}</h2>
        <p className="text-gray-600 mb-4">{group.groupDescription}</p>
        <p className="text-gray-500 mb-6">Members: {group.numMembers}</p>
        <h3 className="text-xl font-bold text-blue-700 mb-4">Rotational Payments</h3>
        <RotationalPaymentTable payments={payments} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default RotationalPayments;