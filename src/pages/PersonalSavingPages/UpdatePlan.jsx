import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { getSavingPlanById, updateSavingPlan } from "../../services/api"

const UpdatePlan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [planName, setPlanName] = useState("")
  const [goalAmount, setGoalAmount] = useState(1000)
  const [currentAmount, setCurrentAmount] = useState(0)
  const [targetDate, setTargetDate] = useState(null)
  const [frequency, setFrequency] = useState("monthly")

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await getSavingPlanById(id)
        const plan = response.data
        setPlanName(plan.planName)
        setGoalAmount(plan.goalAmount)
        setCurrentAmount(plan.currentAmount)
        setTargetDate(new Date(plan.endDate))
        setFrequency(plan.frequency)
      } catch (error) {
        toast.error("Error loading plan")
        navigate("/personal-saving")
      }
    }
    fetchPlan()
  }, [id, navigate])

  const calculateProgress = () => {
    return (currentAmount / goalAmount) * 100
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: planName,
        goalAmount: goalAmount,
        currentAmount: currentAmount,
        endDate: targetDate.toISOString().split("T")[0],
        depositFrequency: frequency,
      }
      await updateSavingPlan(id, payload)
      toast.success("Plan updated successfully")
      navigate(`/view-plan/${id}`)
    } catch (error) {
      toast.error("Error updating plan")
    }
  }

  return (
    <div className="min-h-screen p-4 transition-colors duration-300 bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-800 shadow-indigo-900/20 p-6 transition-all duration-300">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-10"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-500 opacity-10"></div>

          <h1 className="text-2xl font-bold text-center mb-8 text-white">
            <span className="relative">
              Update Saving Plan
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform translate-y-1"></span>
            </span>
          </h1>

          <form className="space-y-6 relative z-10" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-300">Plan Name</label>
              <input
                type="text"
                placeholder="e.g., Dream Vacation"
                className="w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-300">Goal Amount</label>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Rs.{currentAmount.toLocaleString()}</span>
                <span className="text-gray-400">Rs.50,000</span>
              </div>
              <input
                type="range"
                min={currentAmount}
                max={50000}
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                style={{
                  backgroundImage: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((goalAmount - currentAmount) / (50000 - currentAmount)) * 100}%, #374151 ${((goalAmount - currentAmount) / (50000 - currentAmount)) * 100}%, #374151 100%)`,
                }}
              />
              <div className="text-center text-lg font-medium mt-2 text-indigo-300">
                Rs.{goalAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-300">Current Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rs.</span>
                <input
                  type="number"
                  max={goalAmount}
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Math.min(Number(e.target.value), goalAmount))}
                  className="w-full p-3 pl-10 rounded-lg border-2 bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-300">Target End Date</label>
              <div className="react-datepicker-dark">
                <DatePicker
                  selected={targetDate}
                  onChange={(date) => setTargetDate(date)}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  className="w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                  placeholderText="Select target date"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-300">Deposit Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {targetDate && (
              <div className="p-4 rounded-lg mt-4 bg-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-300">Progress</span>
                  <span className="font-medium text-indigo-300">{calculateProgress().toFixed(1)}%</span>
                </div>
                <div className="w-full rounded-full h-3 bg-gray-600">
                  <div
                    className="h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(`/view-plan/${id}`)}
                className="w-1/2 p-3 rounded-lg font-medium transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 p-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Custom CSS for DatePicker in dark mode */}
        <style jsx>{`
          .react-datepicker-dark .react-datepicker {
            background-color: #1f2937;
            border-color: #374151;
          }
          .react-datepicker-dark .react-datepicker__header {
            background-color: #374151;
            border-bottom-color: #4b5563;
          }
          .react-datepicker-dark .react-datepicker__current-month,
          .react-datepicker-dark .react-datepicker__day-name,
          .react-datepicker-dark .react-datepicker__day {
            color: #e5e7eb;
          }
          .react-datepicker-dark .react-datepicker__day:hover {
            background-color: #4f46e5;
          }
          .react-datepicker-dark .react-datepicker__day--selected {
            background-color: #6366f1;
          }
          .react-datepicker-dark .react-datepicker__day--keyboard-selected {
            background-color: #4f46e5;
          }
          .react-datepicker-dark .react-datepicker__day--disabled {
            color: #6b7280;
          }
        `}</style>
      </div>
    </div>
  )
}

export default UpdatePlan
