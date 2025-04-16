import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRotationalPayments, uploadPaymentSlip, getPaymentSlip } from '../../services/api';
import toast from 'react-hot-toast';

const RotationalPayments = () => {
  const { groupId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slipUrls, setSlipUrls] = useState({}); // Store Cloudinary URLs

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getRotationalPayments(groupId);
        setPayments(response.data);

        // Fetch existing slip URLs
        const slipPromises = response.data
          .filter((payment) => payment.slipUrl) // Check if slipUrl exists
          .map(async (payment) => ({
            paymentId: payment.paymentId,
            url: payment.slipUrl, // Use slipUrl directly from payment data
          }));

        const slipResults = await Promise.all(slipPromises);
        const slipUrlMap = slipResults.reduce((acc, { paymentId, url }) => {
          if (url) acc[paymentId] = url;
          return acc;
        }, {});
        setSlipUrls(slipUrlMap);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to fetch payments: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [groupId]);

  const handleFileChange = (paymentId) => async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      const response = await uploadPaymentSlip(paymentId, file);
      toast.success('Slip uploaded successfully');

      // Update slipUrls with the new URL from the response
      const newUrl = response.data.slipUrl; // Assuming the backend returns { slipUrl: "..." }
      setSlipUrls((prev) => ({ ...prev, [paymentId]: newUrl }));

      // Refresh payments to update status
      const updatedResponse = await getRotationalPayments(groupId);
      setPayments(updatedResponse.data);
    } catch (error) {
      console.error('Error uploading slip:', error);
      toast.error('Failed to upload slip: ' + (error.response?.data?.message || error.message));
    }
  };

  const groupedPayments = payments.reduce((acc, payment) => {
    const month = payment.plan.monthNumber;
    if (!acc[month]) {
      acc[month] = { recipient: payment.recipient.username, payments: [] };
    }
    acc[month].payments.push(payment);
    return acc;
  }, {});

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
          Rotational Payments for Group {groupId}
        </h2>
        {Object.keys(groupedPayments).length === 0 ? (
          <p className="text-gray-600 text-center">No payments recorded yet.</p>
        ) : (
          Object.keys(groupedPayments)
            .sort((a, b) => a - b)
            .map((month) => (
              <div key={month} className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                  Month {month}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-4 text-left font-medium">Month</th>
                        <th className="p-4 text-left font-medium">Payer</th>
                        <th className="p-4 text-left font-medium">Recipient</th>
                        <th className="p-4 text-left font-medium">Amount</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">Slip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedPayments[month].payments.map((payment, index) => (
                        <tr
                          key={payment.paymentId}
                          className={`border-b ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                          }`}
                        >
                          <td className="p-4 text-gray-700">{payment.plan.monthNumber}</td>
                          <td className="p-4 text-gray-700">{payment.payer.username}</td>
                          <td className="p-4 text-gray-700">{groupedPayments[month].recipient}</td>
                          <td className="p-4 text-gray-700">${payment.amount.toFixed(2)}</td>
                          <td className="p-4 text-gray-700">{payment.status}</td>
                          <td className="p-4">
                            {slipUrls[payment.paymentId] ? (
                              <img
                                src={slipUrls[payment.paymentId]}
                                alt="Payment Slip"
                                className="max-w-xs h-auto rounded-lg"
                              />
                            ) : (
                              <input
                                type="file"
                                onChange={handleFileChange(payment.paymentId)}
                                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                accept="image/*"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default RotationalPayments;