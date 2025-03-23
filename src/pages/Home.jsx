// src/pages/Home.jsx
const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to DebtMates
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage your debts and finances with ease.
        </p>
        {!token && (
          <div className="space-x-4">
            <a
              href="/user-login" // Updated to user-login
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </a>
            <a
              href="/user-register" // Updated to user-register
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Register
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;