// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import UserLogin from './pages/UserPages/UserLogin';
import UserRegister from './pages/UserPages/UserRegister';
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminRegister from './pages/AdminPages/AdminRegister';
import PasswordReset from './pages/CommonPages/PasswordReset';
import Profile from './pages/CommonPages/Profile';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import EditUser from './pages/CommonPages/EditUser';
import NotFound from './pages/CommonPages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-user/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;