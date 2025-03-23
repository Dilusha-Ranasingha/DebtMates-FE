// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { logout } from '../services/api'; // Import the logout API function

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to invalidate the token
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to logout');
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      // Redirect based on role
      if (isAdmin) {
        navigate('/admin-login');
      } else {
        navigate('/user-login');
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg animate-slideIn">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          DebtMates
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/profile" className="text-white hover:text-blue-200">
                View Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-white hover:text-blue-200">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* <Link to="/user-login" className="text-white hover:text-blue-200">
                User Login
              </Link>
              <Link to="/user-register" className="text-white hover:text-blue-200">
                User Register
              </Link> */}
              
              {/* Removed Admin Login and Admin Register links */}
            </>
          )}
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;