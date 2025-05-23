// src/hooks/useDebt.js
import { useState } from 'react';
import { getGroupDebts, recordDebt } from '../services/api';
import toast from 'react-hot-toast';

const useDebt = (groupId) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const response = await getGroupDebts(groupId);
      setDebts(response.data);
    } catch (error) {
      toast.error('Failed to fetch debts');
    } finally {
      setLoading(false);
    }
  };

  const recordNewDebt = async (data) => {
    setLoading(true);
    try {
      const response = await recordDebt(groupId, data);
      setDebts(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to record debt');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { debts, loading, fetchDebts, recordNewDebt };
};

export default useDebt;