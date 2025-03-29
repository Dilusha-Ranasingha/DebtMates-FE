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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
          Rotational Payments for Group {groupId}
        </h2>
        {dummyPayments.map((monthData) => (
          <div key={monthData.month} className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              Month {monthData.month}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left font-medium">Month</th>
                    <th className="p-4 text-left font-medium">Payer</th>
                    <th className="p-4 text-left font-medium">Recipient</th>
                    <th className="p-4 text-left font-medium">Amount</th>
                    <th className="p-4 text-left font-medium">Upload Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.payments.map((payment, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      <td className="p-4 text-gray-700">{monthData.month}</td>
                      <td className="p-4 text-gray-700">{payment.payer}</td>
                      <td className="p-4 text-gray-700">{monthData.recipient}</td>
                      <td className="p-4 text-gray-700">${payment.amount}</td>
                      <td className="p-4">
                        <input
                          type="file"
                          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          accept="image/*"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotationalPayments;