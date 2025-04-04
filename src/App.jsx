// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserLogin from './pages/UserPages/UserLogin';
import UserRegister from './pages/UserPages/UserRegister';
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminRegister from './pages/AdminPages/AdminRegister';
import PasswordReset from './pages/CommonPages/PasswordReset';
import Profile from './pages/CommonPages/Profile';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import EditUser from './pages/CommonPages/EditUser';
import NotFound from './pages/CommonPages/NotFound';
import Dashboard from './pages/GroupPages/Dashboard';
import CreateGroup from './pages/GroupPages/CreateGroup';
import GroupDetails from './pages/GroupPages/GroupDetails';
import EditGroup from './pages/GroupPages/EditGroup';
import AddMembers from './pages/GroupPages/AddMembers';
import RecordDebt from './pages/GroupPages/RecordDebt';
import Home from './pages/Home';
import DebtSummary from './pages/GroupPages/DebtSummary';
import RotationalPage from './pages/RotationalPlanPages/RotationalPage';
import CreateRotationalGroup from './pages/RotationalPlanPages/CreateRotationalGroup';
import EditRotationalGroup from './pages/RotationalPlanPages/EditRotationalGroup';
import AddRotationalMembers from './pages/RotationalPlanPages/AddRotationalMembers';
import CreateRotationalPlan from './pages/RotationalPlanPages/CreateRotationalPlan';
import RotationalPayments from './pages/RotationalPlanPages/RotationalPayments';
import UploadSlip from './pages/RotationalPlanPages/UploadSlip';
import DashboardPage from './pages/DashboardPage';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboardPage" element={<DashboardPage />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/user-register" element={<UserRegister />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/edit-user/:id" element={<ProtectedRoute requiredRole="ADMIN"><EditUser /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
              <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
              <Route path="/groups/:groupId/debts" element={<DebtSummary />} />
              <Route path="/groups/:groupId/edit" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />
              <Route path="/groups/:groupId/add-members" element={<ProtectedRoute><AddMembers /></ProtectedRoute>} />
              <Route path="/groups/:groupId/record-debt" element={<ProtectedRoute><RecordDebt /></ProtectedRoute>} />
              <Route path="/rotational-page" element={<ProtectedRoute><RotationalPage /></ProtectedRoute>} />
              <Route path="/rotational/create" element={<ProtectedRoute><CreateRotationalGroup /></ProtectedRoute>} />
              <Route path="/rotational/groups/:groupId" element={<ProtectedRoute><EditRotationalGroup /></ProtectedRoute>} />
              <Route path="/rotational/groups/:groupId/members" element={<ProtectedRoute><AddRotationalMembers /></ProtectedRoute>} />
              <Route path="/rotational/groups/:groupId/plan" element={<ProtectedRoute><CreateRotationalPlan /></ProtectedRoute>} />
              <Route path="/rotational/:groupId/payments" element={<ProtectedRoute><RotationalPayments /></ProtectedRoute>} />
              <Route path="/rotational/payments/:paymentId/upload-slip" element={<ProtectedRoute><UploadSlip /></ProtectedRoute>} />
              <Route path="/aboutUs" element={<About/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;