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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await getRotationalGroups();
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const createNewGroup = async (groupData) => {
    try {
      const response = await createRotationalGroup(groupData);
      setGroups([...groups, response.data]);
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
      throw error;
    }
  };

  const updateExistingGroup = async (groupId, groupData) => {
    try {
      const response = await updateRotationalGroup(groupId, groupData);
      setGroups(groups.map((group) => (group.groupId === groupId ? response.data : group)));
      toast.success('Group updated successfully');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
      throw error;
    }
  };

  const addMembers = async (groupId, memberIds) => {
    try {
      const response = await addRotationalMembers(groupId, memberIds);
      setGroups(groups.map((group) => (group.groupId === groupId ? response.data : group)));
      toast.success('Members added successfully');
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error('Failed to add members');
      throw error;
    }
  };

  const createPlan = async (groupId, planData) => {
    try {
      const response = await createRotationalPlan(groupId, planData);
      toast.success('Plan created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create plan');
      throw error;
    }
  };

  const fetchPayments = async (groupId) => {
    try {
      const response = await getRotationalPayments(groupId);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
      throw error;
    }
  };

  const uploadSlip = async (paymentId, slipData) => {
    try {
      const response = await uploadPaymentSlip(paymentId, slipData);
      setPayments(payments.map((payment) =>
        payment.paymentId === paymentId ? response.data : payment
      ));
      toast.success('Slip uploaded successfully');
    } catch (error) {
      console.error('Error uploading slip:', error);
      toast.error('Failed to upload slip');
      throw error;
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await deleteRotationalGroup(groupId);
      setGroups(groups.filter((group) => group.groupId !== groupId));
      toast.success('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
      throw error;
    }
  };

  return {
    groups,
    payments,
    loading,
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