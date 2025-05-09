import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getAllUsers, getAllAdmins, getUserById, updateUser } from '../../services/api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [adminActivity, setAdminActivity] = useState([]);
  const [adminLoginActivity, setAdminLoginActivity] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('users'); // 'users' or 'admins'
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
    const username = payload.sub;
    setIsSuperAdmin(username === 'SuperAdmin');

    if (tab === 'users') {
      fetchUsers();
      fetchUserActivity();
    } else if (isSuperAdmin && tab === 'admins') {
      fetchAdmins();
      fetchAdminActivity();
      fetchAdminLoginActivity();
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

  const fetchUserActivity = async () => {
    try {
      const response = await getAllUsers(page); // Assuming this returns activity data
      setUserActivity(response.data.content); // Adjust based on actual API response
    } catch (error) {
      toast.error('Failed to fetch user activity');
    }
  };

  const fetchAdminActivity = async () => {
    try {
      const response = await getAllAdmins(page); // Assuming this returns activity data
      setAdminActivity(response.data.content); // Adjust based on actual API response
    } catch (error) {
      toast.error('Failed to fetch admin activity');
    }
  };

  const fetchAdminLoginActivity = async () => {
    try {
      const response = await getAllAdmins(page); // Assuming this returns login activity
      setAdminLoginActivity(response.data.content); // Adjust based on actual API response
    } catch (error) {
      toast.error('Failed to fetch admin login activity');
    }
  };

  const handleEditAdmin = async (id) => {
    try {
      const admin = await getUserById(id);
      navigate(`/admin/edit-user/${id}`, { state: { user: admin.data } });
    } catch (error) {
      toast.error('Failed to fetch admin details');
    }
  };

  const handleDeleteAdmin = async (id) => {
    setLoading(true);
    try {
      await updateUser(id, { role: 'USER' }); // Demote admin to user as a "delete"
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Admin deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const userActivityChartData = {
    labels: userActivity.map(activity => new Date(activity.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'User Registrations',
        data: userActivity.map((_, index) => index + 1),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Tailwind's blue-500
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  };

  const adminActivityChartData = {
    labels: adminActivity.map(activity => new Date(activity.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Admin Registrations',
        data: adminActivity.map((_, index) => index + 1),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  };

  const adminLoginActivityChartData = {
    labels: adminLoginActivity.map(activity => new Date(activity.loginTime).toLocaleDateString()),
    datasets: [
      {
        label: 'Admin Logins',
        data: adminLoginActivity.map((_, index) => index + 1),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#d1d5db' } }, // Tailwind's gray-300
      title: { display: true, color: '#d1d5db' },
    },
    scales: {
      x: { ticks: { color: '#d1d5db' }, grid: { color: '#374151' } }, // Tailwind's gray-700
      y: { ticks: { color: '#d1d5db' }, grid: { color: '#374151' } },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Profile
          </button>
        </div>
        <div className="mb-6 space-x-2">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 mr-2 rounded-lg ${
              tab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300'
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
                  : 'bg-gray-700/50 text-gray-300'
              } hover:bg-blue-500 hover:text-white transition`}
            >
              Admins
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => navigate('/admin-register')}
              className={`px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-blue-500 hover:text-white transition`}
            >
              Add Admins
            </button>
          )}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <>
            {/* User List */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registered Users</h3>
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-400">No users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-3">ID</th>
                          <th className="p-3">Username</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-700">
                            <td className="p-3">{user.id}</td>
                            <td className="p-3">{user.username}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* User Registration Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">User Registration Activity</h3>
                <div className="mb-6">
                  <Bar
                    data={userActivityChartData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'User Registrations Over Time' } },
                    }}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="bg-gray-700/50 text-left">
                        <th className="p-3">Username</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivity.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-700">
                          <td className="p-3">{activity.username}</td>
                          <td className="p-3">{activity.email}</td>
                          <td className="p-3">{new Date(activity.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Admins Tab (SuperAdmin Only) */}
        {tab === 'admins' && isSuperAdmin && (
          <>
            {/* Admin List */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Registered Admins</h3>
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : admins.length === 0 ? (
                  <p className="text-gray-400">No admins found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-gray-300">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-3">ID</th>
                          <th className="p-3">Username</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin.id} className="border-b border-gray-700">
                            <td className="p-3">{admin.id}</td>
                            <td className="p-3">{admin.username}</td>
                            <td className="p-3">{admin.email}</td>
                            <td className="p-3">{admin.role}</td>
                            <td className="p-3 space-x-2">
                              <button
                                onClick={() => handleEditAdmin(admin.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
              </div>
            </div>

            {/* Admin Registration Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Admin Registration Activity</h3>
                <div className="mb-6">
                  <Bar
                    data={adminActivityChartData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'Admin Registrations Over Time' } },
                    }}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="bg-gray-700/50 text-left">
                        <th className="p-3">Username</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminActivity.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-700">
                          <td className="p-3">{activity.username}</td>
                          <td className="p-3">{activity.email}</td>
                          <td className="p-3">{new Date(activity.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Admin Login Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Admin Login Activity</h3>
                <div className="mb-6">
                  <Line
                    data={adminLoginActivityChartData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { display: true, text: 'Admin Logins Over Time' } },
                    }}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="bg-gray-700/50 text-left">
                        <th className="p-3">Username</th>
                        <th className="p-3">Login Time</th>
                        <th className="p-3">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminLoginActivity.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-700">
                          <td className="p-3">{activity.username}</td>
                          <td className="p-3">{new Date(activity.loginTime).toLocaleString()}</td>
                          <td className="p-3">{activity.ipAddress || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0 || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1 || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminDashboard;