// src/pages/NotFound.jsx
const NotFound = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFound;