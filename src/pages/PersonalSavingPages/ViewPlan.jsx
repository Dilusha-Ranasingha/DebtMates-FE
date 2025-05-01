import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSavingPlanById, deleteSavingPlan, recordSavingTransaction } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewPlan = () => {
    const [plan, setPlan] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await getSavingPlanById(id);
                setPlan(response.data);
            } catch (error) {
                toast.error('Error loading plan details');
                navigate('/personal-saving');
            }
        };
        fetchPlan();
    }, [id, navigate]);

    const handleDeletePlan = async () => {
        try {
            await deleteSavingPlan(id);
            toast.success('Plan deleted successfully');
            navigate('/personal-saving');
        } catch (error) {
            toast.error('Error deleting plan');
        }
    };

    const handleSaveDeposit = async () => {
        try {
            await recordSavingTransaction(id, { amount: parseFloat(depositAmount) });
            toast.success('Deposit recorded successfully', {
                autoClose: 3000, // Close after 3 seconds
            });
            setShowDepositModal(false);
            setDepositAmount(''); // Clear input
            // Refresh plan data
            const response = await getSavingPlanById(id);
            setPlan(response.data);
        } catch (error) {
            toast.error('Error recording deposit');
        }
    };

    const handleUpdatePlan = () => {
        navigate(`/update-plan/${id}`);
    };

    if (!plan) {
        return <div>Loading...</div>;
    }

    const progress = plan.goalAmount > 0 ? (plan.currentAmount / plan.goalAmount) : 0;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', { 
            style: 'currency', 
            currency: 'LKR', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0, 
        }).format(amount);
    };

    return (
        <div className="p-8 relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">{plan.planName}</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleUpdatePlan}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                        Update Plan
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Delete Plan
                    </button>
                </div>
            </div>

            {/* Glassmorphism Progress Card */}
            <div className="backdrop-blur-lg bg-white/30 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-center mb-6">
                    <div className="relative h-40 w-40">
                        <svg className="transform -rotate-90 h-40 w-40">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="#E2E8F0"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="#4F46E5"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="439.8"
                                strokeDashoffset={439.8 * (1 - progress)} // Dynamic progress
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="text-2xl font-bold">{Math.round(progress * 100)}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <i className="fas fa-piggy-bank text-2xl mb-2"></i>
                        <p className="text-sm text-gray-600">Current Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(plan.currentAmount)}</p>
                    </div>
                    <div className="text-center">
                        <i className="fas fa-trending-up text-2xl mb-2"></i>
                        <p className="text-sm text-gray-600">Goal Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(plan.goalAmount)}</p>
                    </div>
                    <div className="text-center">
                        <i className="fas fa-calendar text-2xl mb-2"></i>
                        <p className="text-sm text-gray-600">Next Deposit Due</p>
                        <p className="text-xl font-bold">{plan.nextDepositDate}</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => setShowDepositModal(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Record Deposit
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this saving plan?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeletePlan}
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Record Deposit</h2>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="w-full border rounded-md px-4 py-2 mb-4"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            min="100" // Assuming minimum deposit is 100 LKR
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDepositModal(false)}
                                className="px-4 py-2 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveDeposit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add this CSS at the top of your file after the imports
const styles = `
    @keyframes fade-in {
        from { opacity: 0; transform: translate(-50%, -60%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
    }
`;

// Add the style tag to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ViewPlan;