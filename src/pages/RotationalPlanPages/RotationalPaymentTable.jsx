// src/components/Rotational/RotationalPaymentTable.jsx
import { Link } from 'react-router-dom';
 
const RotationalPaymentTable = ({ payments, currentUserId }) => {
  if (!payments || payments.length === 0) {
    return <p className="text-gray-600">No payments recorded yet.</p>;
  }

  // Group payments by monthNumber
  const groupedPayments = payments.reduce((acc, payment) => {
    const month = payment.plan.monthNumber;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(payment);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.keys(groupedPayments)
        .sort((a, b) => a - b)
        .map((month) => (
          <div key={month}>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Month {month}</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Payer</th>
                    <th className="p-3 text-left">Recipient</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Slip</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPayments[month].map((payment) => (
                    <tr key={payment.paymentId} className="border-b">
                      <td className="p-3">{payment.plan.monthNumber}</td>
                      <td className="p-3">{payment.payer.username}</td>
                      <td className="p-3">{payment.recipient.username}</td>
                      <td className="p-3">${payment.amount.toFixed(2)}</td>
                      <td className="p-3">{payment.status}</td>
                      <td className="p-3">
                        {payment.slip ? (
                          <a
                            href={URL.createObjectURL(new Blob([payment.slip]))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Slip
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-3">
                        {payment.payer.id === currentUserId && payment.status === 'Not Started' && (
                          <Link
                            to={`/rotational/payments/${payment.paymentId}/upload-slip`}
                            className="btn-primary"
                          >
                            Upload Slip
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RotationalPaymentTable;