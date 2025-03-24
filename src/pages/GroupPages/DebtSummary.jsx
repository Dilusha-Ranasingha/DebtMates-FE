import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getGroupDebts } from '../../services/api';

const DebtSummary = () => {
  const { groupId } = useParams(); // Get groupId from the URL
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        console.log('Fetching debts for group ID:', groupId); // Debug groupId
        const response = await getGroupDebts(groupId); // Fetch debts using the API
        console.log('API Response:', response.data); // Debug API response
        setDebts(response.data); // Set the debts data
      } catch (error) {
        console.error('Error fetching debts:', error); // Debug errors
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [groupId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Debt Summary</h2>
        {debts.length === 0 ? (
          <p className="text-gray-600">No debts found for this group.</p>
        ) : (
          <ul className="space-y-4">
            {debts.map((debt, index) => (
              <li key={index} className="p-4 bg-white shadow rounded">
                <p><strong>Member Name:</strong> {debt.memberName}</p>
                <p><strong>Contributed:</strong> ${debt.contributed}</p>
                <p><strong>Expected:</strong> ${debt.expected}</p>
                <p><strong>To Whom to Pay:</strong> {debt.toWhoPay || 'N/A'}</p>
                <p><strong>Amount:</strong> ${debt.amountToPay || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebtSummary;