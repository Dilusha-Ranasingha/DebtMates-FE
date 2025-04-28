import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { getSavingPlanById, updateSavingPlan } from '../../services/api';

const UpdatePlan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [planName, setPlanName] = useState('')
    const [goalAmount, setGoalAmount] = useState(1000)
    const [currentAmount, setCurrentAmount] = useState(0)
    const [targetDate, setTargetDate] = useState(null)
    const [frequency, setFrequency] = useState('monthly')

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await getSavingPlanById(id);
                const plan = response.data;
                setPlanName(plan.planName);
                setGoalAmount(plan.goalAmount);
                setCurrentAmount(plan.currentAmount);
                setTargetDate(new Date(plan.endDate));
                setFrequency(plan.frequency);
            } catch (error) {
                toast.error('Error loading plan');
                navigate('/personal-saving');
            }
        };
        fetchPlan();
    }, [id, navigate]);

    const calculateProgress = () => {
        return (currentAmount / goalAmount) * 100
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
          const payload = {
            title: planName,
            goalAmount: goalAmount,
            currentAmount: currentAmount,
            endDate: targetDate.toISOString().split('T')[0],
            depositFrequency: frequency,
          };
          await updateSavingPlan(id, payload);
          toast.success('Plan updated successfully');
          navigate(`/view-plan/${id}`);
        } catch (error) {
          toast.error('Error updating plan');
        }
      };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Update Saving Plan</h1>
                
                <form className="space-y-4" onSubmit={handleUpdate}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Plan Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Dream Vacation"
                            className="w-full p-2 border rounded"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Goal Amount</label>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Rs.{currentAmount}</span>
                            <span>Rs.50,000</span>
                        </div>
                        <input
                            type="range"
                            min={currentAmount}
                            max={50000}
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-center text-lg font-medium mt-1">
                            Rs.{goalAmount.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Current Amount</label>
                        <input
                            type="number"
                            max={goalAmount}
                            value={currentAmount}
                            onChange={(e) => setCurrentAmount(Math.min(Number(e.target.value), goalAmount))}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target End Date</label>
                        <DatePicker
                            selected={targetDate}
                            onChange={(date) => setTargetDate(date)}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            className="w-full p-2 border rounded"
                            placeholderText="Select target date"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deposit Frequency</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {targetDate && (
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <div className="flex justify-between mb-2">
                                <span>Progress</span>
                                <span>{calculateProgress().toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/view-plan')}
                            className="w-1/2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdatePlan;