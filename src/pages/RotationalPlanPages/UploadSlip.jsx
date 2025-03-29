// src/pages/RotationalPlanPages/UploadSlip.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRotational from '../../hooks/useRotational';
import { getRotationalPayments } from '../../services/api';
import toast from 'react-hot-toast';

const UploadSlip = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { uploadSlip } = useRotational();
  const [file, setFile] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await getRotationalPayments(null); // Fetch all payments
        const payment = response.data.find((p) => p.paymentId === parseInt(paymentId));
        if (!payment) {
          navigate('/rotational-page');
          return;
        }
        setGroupId(payment.plan.group.groupId);

        // Check if the current user is the payer
        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const currentUserId = payload.id;
        if (payment.payer.id !== currentUserId) {
          navigate(`/rotational/${payment.plan.group.groupId}/payments`);
        }
      } catch (error) {
        navigate('/rotational-page');
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        await uploadSlip(paymentId, blob);
        navigate(`/rotational/${groupId}/payments`);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading slip:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Upload Payment Slip
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Slip (Image)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSlip;