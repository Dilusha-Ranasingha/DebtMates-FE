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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-8">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
          Debt Summary
        </h2>
        {debts.length === 0 ? (
          <p className="text-lg text-gray-700 text-center">
            No debts found for this group.
          </p>
        ) : (
          <ul className="space-y-6">
            {debts.map((debt, index) => (
              <li
                key={index}
                className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-lg font-semibold text-gray-800">
                  <strong>Member Name:</strong> {debt.memberName}
                </p>
                <p className="text-gray-700">
                  <strong>Contributed:</strong>{" "}
                  <span className="text-green-600">${debt.contributed}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Expected:</strong>{" "}
                  <span className="text-red-600">${debt.expected}</span>
                </p>
                <p className="text-gray-700">
                  <strong>To Whom to Pay:</strong>{" "}
                  <span className="text-blue-600">
                    {debt.toWhoPay || "N/A"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong>{" "}
                  <span className="text-purple-600">
                    ${debt.amountToPay || "N/A"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebtSummary;