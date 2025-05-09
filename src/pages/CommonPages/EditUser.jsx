import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import InputField from '../../components/InputField';
import { getUserById, updateUser, updateAdmin } from '../../services/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdminEdit, setIsAdminEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
      navigate('/admin-login');
      return;
    }

    fetchUser();
  }, [id, navigate]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await getUserById(id);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      });
      // Check if this is an admin being edited
      setIsAdminEdit(response.data.role === 'ADMIN');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to fetch user');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isAdminEdit) {
        await updateAdmin(id, formData);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Admin updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await updateUser(id, formData);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      }
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          {isAdminEdit ? 'Edit Admin' : 'Edit User'}
        </h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {isAdminEdit ? 'Update Admin' : 'Update User'}
            </button>
          </form>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default EditUser;