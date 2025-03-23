// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getAllUsers, getAllAdmins, deleteUser } from '../../services/api';
import Dialog from '../../components/Dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('users'); // 'users' or 'admins'
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
      navigate('/admin-login');
      return;
    }

    // Decode the JWT token to get the username
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const username = payload.sub; // "sub" claim contains the username
    setIsSuperAdmin(username === 'SuperAdmin');

    if (tab === 'users') {
      fetchUsers();
    } else if (isSuperAdmin && tab === 'admins') {
      fetchAdmins();
    }
  }, [page, tab, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(page);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAllAdmins(page);
      setAdmins(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(deleteDialog.userId);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
      if (tab === 'users') {
        fetchUsers();
      } else {
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data || 'Failed to delete user');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, userId: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">
            Admin Dashboard
          </h2>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            View Profile
          </button>
        </div>
        <div className="mb-6">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 mr-2 rounded-lg ${
              tab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-500 hover:text-white transition`}
          >
            Users
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setTab('admins')}
              className={`px-4 py-2 rounded-lg ${
                tab === 'admins'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-500 hover:text-white transition`}
            >
              Admins
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (tab === 'users' ? users : admins).length === 0 ? (
          <p className="text-gray-600">
            No {tab === 'users' ? 'users' : 'admins'} found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(tab === 'users' ? users : admins).map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                        className="btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({ open: true, userId: user.id })
                        }
                        className="btn-danger"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0 || loading}
            className="btn-primary disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1 || loading}
            className="btn-primary disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
      <Dialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
      />
      <Toaster />
    </div>
  );
};

export default AdminDashboard;