import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../services/api';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate(isAdmin ? '/admin-login' : '/');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slideIn ${scrolled ? 'bg-[#0f111a]/90 backdrop-blur-md shadow-lg' : 'bg-[#0f111a]'}`}>    
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to={token ? "/dashboardPage" : "/"} className="text-white text-2xl font-bold group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">DebtMates</span>
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Debts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/rotational-page" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Rotational Savings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/savings" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Personal Savings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/profile" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                  Admin
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group"
              >
                Logout
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </>
          ) : (
            <>
              <Link to="/user-login" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-blue-900/30">
                Login
              </Link>
              <Link to="/user-register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-md hover:shadow-blue-500/20">
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