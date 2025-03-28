// src/pages/RotationalPlanPages/RotationalPayments.jsx
import { useParams } from 'react-router-dom';

const RotationalPayments = () => {
  const { groupId } = useParams();

  // Dummy data for payments
  const dummyPayments = [
    {
      month: 1,
      recipient: 'Member 1',
      payments: [
        { payer: 'Member 2', amount: 5000, status: 'Paid', slip: '[Image Link]' },
        { payer: 'Member 3', amount: 5000, status: 'Pending', slip: '[Upload]' },
        { payer: 'Member 4', amount: 5000, status: 'Not Started', slip: '-' },
        { payer: 'Member 5', amount: 5000, status: 'Paid', slip: '[Image Link]' },
      ],
    },
    {
      month: 2,
      recipient: 'Member 2',
      payments: [
        { payer: 'Member 1', amount: 5000, status: 'Paid', slip: '[Image Link]' },
        { payer: 'Member 3', amount: 5000, status: 'Pending', slip: '[Upload]' },
        { payer: 'Member 4', amount: 5000, status: 'Not Started', slip: '-' },
        { payer: 'Member 5', amount: 5000, status: 'Paid', slip: '[Image Link]' },
      ],
    },
    {
      month: 3,
      recipient: 'Member 3',
      payments: [
        { payer: 'Member 1', amount: 5000, status: 'Paid', slip: '[Image Link]' },
        { payer: 'Member 2', amount: 5000, status: 'Pending', slip: '[Upload]' },
        { payer: 'Member 4', amount: 5000, status: 'Not Started', slip: '-' },
        { payer: 'Member 5', amount: 5000, status: 'Paid', slip: '[Image Link]' },
      ],
    },
    {
      month: 4,
      recipient: 'Member 4',
      payments: [
        { payer: 'Member 1', amount: 5000, status: 'Paid', slip: '[Image Link]' },
        { payer: 'Member 2', amount: 5000, status: 'Pending', slip: '[Upload]' },
        { payer: 'Member 3', amount: 5000, status: 'Not Started', slip: '-' },
        { payer: 'Member 5', amount: 5000, status: 'Paid', slip: '[Image Link]' },
      ],
    },
    {
      month: 5,
      recipient: 'Member 5',
      payments: [
        { payer: 'Member 1', amount: 5000, status: 'Paid', slip: '[Image Link]' },
        { payer: 'Member 2', amount: 5000, status: 'Pending', slip: '[Upload]' },
        { payer: 'Member 3', amount: 5000, status: 'Not Started', slip: '-' },
        { payer: 'Member 4', amount: 5000, status: 'Paid', slip: '[Image Link]' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Rotational Payments for Group {groupId}
        </h2>
        {dummyPayments.map((monthData) => (
          <div key={monthData.month} className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Month {monthData.month}
            </h3>
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-left">Payer</th>
                  <th className="p-3 text-left">Recipient</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Slip</th>
                </tr>
              </thead>
              <tbody>
                {monthData.payments.map((payment, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{monthData.month}</td>
                    <td className="p-3">{payment.payer}</td>
                    <td className="p-3">{monthData.recipient}</td>
                    <td className="p-3">${payment.amount}</td>
                    <td className="p-3">{payment.status}</td>
                    <td className="p-3">{payment.slip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotationalPayments;