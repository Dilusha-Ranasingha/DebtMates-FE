// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/user-login');
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
              <Link to="/user-login" className="text-white hover:text-blue-200">
                User Login
              </Link>
              <Link to="/user-register" className="text-white hover:text-blue-200">
                User Register
              </Link>
              {/* Removed Admin Login and Admin Register links */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;