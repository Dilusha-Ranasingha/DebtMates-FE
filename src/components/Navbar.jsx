import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../services/api';
import { useState, useEffect } from 'react';
import dashboardLogo from '../assets/daashboardLogo.png'; // Import the logo

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
      toast.success('Logged out successfully', {
        style: {
          background: '#1f2937', // Tailwind's bg-gray-800
          color: '#ffffff', // Tailwind's text-white
          borderRadius: '0.375rem', // Tailwind's rounded-md
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind's shadow-md
        },
        iconTheme: {
          primary: '#3b82f6', // Tailwind's blue-500
          secondary: '#ffffff', // Tailwind's text-white
        },
      });
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
        <Link to={token ? "/dashboardPage" : "/"} className="flex items-center group">
          <img 
            src={dashboardLogo} 
            alt="DebtMates Logo" 
            className="h-8 w-auto transition-all duration-300 group-hover:brightness-125"
          />
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
              <Link to="/personal-saving" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
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