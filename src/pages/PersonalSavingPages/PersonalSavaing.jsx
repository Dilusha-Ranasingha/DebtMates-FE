import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSavingPlans, getSavingStats } from '../../services/api';
import { toast } from 'react-toastify';

const PersonalSavaing = () => {
    const [plans, setPlans] = useState([]);
    const [stats, setStats] = useState({ totalSaved: 0, totalGoal: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch plans first, then stats if plans succeed
                const plansResponse = await getAllSavingPlans();
                setPlans(plansResponse.data);
                
                try {
                    const statsResponse = await getSavingStats();
                    setStats(statsResponse.data);
                } catch (statsError) {
                    console.error('Stats error:', statsError);
                    // Calculate stats from plans as fallback
                    const totalSaved = plansResponse.data.reduce((sum, plan) => sum + plan.currentAmount, 0);
                    const totalGoal = plansResponse.data.reduce((sum, plan) => sum + plan.goalAmount, 0);
                    setStats({ totalSaved, totalGoal });
                }
            } catch (error) {
                toast.error('Error loading savings data');
                console.error('Error:', error);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalGoal = stats.totalGoal;
    const totalSaved = stats.totalSaved;
    const totalProgress = totalGoal > 0 ? Math.round((totalSaved / totalGoal) * 100) : 0;
  
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('LKR', 'Rs.');
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Track and manage your savings goals</h1>
            
            {/* Overall Progress Section */}
            <div className="mb-8">
                <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/30 max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
                    <div className="flex items-center justify-between">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="stroke-gray-200"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    strokeWidth="8"
                                />
                                <circle
                                    className="stroke-blue-500 transform -rotate-90 origin-center transition-all duration-1000"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset="200"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <p className="text-xl font-bold">30%</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="font-semibold">Saved: {formatCurrency(totalSaved)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">Goal: {formatCurrency(totalGoal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Active Saving Plan  */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Active Savings Plans</h2>
                    <button 
                        onClick={() => navigate('/create-plan')} 
                        className="inline-flex items-center px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Plan
                    </button>
                </div>

                {/* Plan List */}
                {plans.length === 0 ? (
                    <div className="text-center py-12 bg-white/20 backdrop-blur-lg rounded-lg">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">No active savings plans</h3>
                        <p className="text-gray-500 mb-4">Start your savings journey by creating a new plan</p>
                        <button 
                            onClick={() => navigate('/create-plan')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Create Your First Plan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map(plan => (
                            <div 
                            key={plan.id} 
                            className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-200"
                            onClick={() => navigate(`/view-plan/${plan.id}`)}
                            >
                                <h3 className="font-semibold text-lg mb-3">{plan.planName}</h3>
                                <div className="space-y-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${(plan.currentAmount / plan.goalAmount) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>{formatCurrency(plan.currentAmount)}</span>
                                        <span>{formatCurrency(plan.goalAmount)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Next deposit: {plan.nextDepositDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalSavaing;