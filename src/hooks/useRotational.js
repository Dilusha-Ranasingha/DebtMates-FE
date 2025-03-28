// src/hooks/useRotational.js
import { useState, useEffect } from 'react';
import {
  getRotationalGroups,
  createRotationalGroup,
  updateRotationalGroup,
  addRotationalMembers,
  createRotationalPlan,
  getRotationalPayments,
  uploadPaymentSlip,
  deleteRotationalGroup,
} from '../services/api';
import toast from 'react-hot-toast';

const useRotational = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getRotationalGroups();
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to fetch rotational groups');
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (data) => {
    setLoading(true);
    try {
      const response = await createRotationalGroup(data);
      setGroups([...groups, response.data]);
      toast.success('Group created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to create group');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingGroup = async (groupId, data) => {
    setLoading(true);
    try {
      const response = await updateRotationalGroup(groupId, data);
      setGroups(groups.map((g) => (g.groupId === groupId ? response.data : g)));
      toast.success('Group updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update group');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMembers = async (groupId, memberIds) => {
    setLoading(true);
    try {
      const response = await addRotationalMembers(groupId, memberIds);
      setGroups(groups.map((g) => (g.groupId === groupId ? response.data : g)));
      toast.success('Members added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add members');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (groupId, data) => {
    setLoading(true);
    try {
      const response = await createRotationalPlan(groupId, data);
      toast.success('Plan created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to create plan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (groupId) => {
    setLoading(true);
    try {
      const response = await getRotationalPayments(groupId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to fetch payments');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadSlip = async (paymentId, slipData) => {
    setLoading(true);
    try {
      const response = await uploadPaymentSlip(paymentId, slipData);
      toast.success('Slip uploaded successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to upload slip');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    setLoading(true);
    try {
      await deleteRotationalGroup(groupId);
      setGroups(groups.filter((g) => g.groupId !== groupId));
      toast.success('Group deleted successfully');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to delete group');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    fetchGroups,
    createNewGroup,
    updateExistingGroup,
    addMembers,
    createPlan,
    fetchPayments,
    uploadSlip,
    deleteGroup,
  };
};

export default useRotational;