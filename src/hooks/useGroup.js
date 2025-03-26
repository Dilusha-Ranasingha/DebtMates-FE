// src/hooks/useGroup.js
import { useState, useEffect } from 'react';
import { getUserGroups, createGroup, updateGroup } from '../services/api';
import toast from 'react-hot-toast';

const useGroup = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getUserGroups();
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (data) => {
    setLoading(true);
    try {
      const response = await createGroup(data);
      setGroups([...groups, response.data]);
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
      const response = await updateGroup(groupId, data);
      setGroups(groups.map((g) => (g.groupId === groupId ? response.data : g)));
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update group');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, fetchGroups, createNewGroup, updateExistingGroup };
};

export default useGroup;