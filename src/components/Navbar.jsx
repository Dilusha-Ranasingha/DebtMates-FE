// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate(isAdmin ? '/admin-login' : '/user-login');
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
              <Link to="/dashboard" className="text-white hover:text-blue-200">
                Debts
              </Link>
              <Link to="/#" className="text-white hover:text-blue-200">
                Rotational Savings
              </Link>
              <Link to="/personal-saving" className="text-white hover:text-blue-200">
                Personal Savings
              </Link>
              <Link to="/profile" className="text-white hover:text-blue-200">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-white hover:text-blue-200">
                  Admin
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
              <Link to="/user-login" className="text-white hover:text-blue-200">
                User Login
              </Link>
              <Link to="/user-register" className="text-white hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;