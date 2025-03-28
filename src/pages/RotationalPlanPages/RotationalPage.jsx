import React from 'react'

const RotationalPage = () => {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Financial Rotational Details</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
            Explore and manage your financial rotational plans with ease and precision.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Plan Overview</h2>
                <p className="text-gray-700">
                    Get a detailed overview of your current rotational plans and their progress.
                </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Financial Insights</h2>
                <p className="text-gray-700">
                    Analyze your financial data and gain insights to optimize your plans.
                </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Action Items</h2>
                <p className="text-gray-700">
                    Stay on top of your tasks with a list of actionable items for your plans.
                </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Support</h2>
                <p className="text-gray-700">
                    Reach out to our support team for assistance with your rotational plans.
                </p>
            </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
        </button>
    </div>
)
}

export default RotationalPage